import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tree, TreeApi, NodeRendererProps } from "react-arborist";

// Define types for tree nodes
interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isLeaf: boolean;
  isOpen?: boolean;
  toggle?: () => void;
}

// Custom Node Renderer for icons and styling (defined outside FileTree)
const Node: React.FC<NodeRendererProps<TreeNode>> = ({
  node,
  style,
  dragHandle,
}) => {
  const indent = (node.level || 0) * 20;

  // Get file extension to determine icon
  const getFileIcon = (name: string) => {
    if (!node.isLeaf) return "folder";
    if (name.endsWith(".go")) return "go";
    if (name.endsWith(".mod") || name.endsWith(".sum")) return "go-mod";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".md")) return "markdown";
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    return "file";
  };

  const fileType = getFileIcon(node.data.name);

  return (
    <motion.div
      className={`flex items-center px-2 py-1 rounded cursor-pointer ${
        node.isSelected
          ? "bg-primary-500/20 text-primary-500 dark:text-primary-300"
          : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
      }`}
      style={{
        ...style,
        paddingLeft: `${indent + 8}px`,
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      ref={dragHandle}
    >
      {/* Icon based on file type */}
      <span className="mr-2 text-gray-500 dark:text-gray-400 w-5 flex-shrink-0">
        {fileType === "folder" && (
          <svg
            className={`w-4 h-4 transition-transform ${
              node.isOpen ? "transform rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={node.isOpen ? "M9 5l7 7-7 7" : "M9 5l7 7-7 7"}
            ></path>
          </svg>
        )}
      </span>
      {/* File/Folder name */}
      <motion.span
        className="truncate flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {node.data.name}
      </motion.span>
    </motion.div>
  );
};

// Helper function to build tree structure from flat file paths
function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode = {
    id: "__root__",
    name: "root",
    children: [],
    isLeaf: false,
  };
  const map: Record<string, TreeNode> = { "": root };

  paths.sort();

  for (const path of paths) {
    const parts = path.split("/");
    let parentPath = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const currentPath = parentPath ? `${parentPath}/${part}` : part;
      const isLeafNode = i === parts.length - 1;
      let currentNode = map[currentPath];
      if (!currentNode) {
        currentNode = {
          id: currentPath,
          name: part,
          isLeaf: isLeafNode,
          children: isLeafNode ? undefined : [],
        };
        map[currentPath] = currentNode;
        const parentNode = map[parentPath];
        if (parentNode && parentNode.children) {
          if (
            !parentNode.children.some((child) => child.id === currentNode.id)
          ) {
            parentNode.children.push(currentNode);
          }
        }
      } else {
        if (!isLeafNode) {
          currentNode.isLeaf = false;
          if (!currentNode.children) {
            currentNode.children = [];
          }
        }
      }
      parentPath = currentPath;
    }
  }

  return root.children ?? [];
}

interface FileTreeProps {
  filePaths: string[];
  onSelectFile: (filePath: string) => void;
  initialSelectedFile?: string | null;
  height?: number | string;
}

// Main FileTree component
function FileTree({
  filePaths,
  onSelectFile,
  initialSelectedFile,
}: FileTreeProps) {
  const treeData = React.useMemo(() => buildTree(filePaths), [filePaths]);
  const treeRef = React.useRef<TreeApi<TreeNode>>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedFolders, setExpandedFolders] = React.useState<string[]>([]);

  // Effect to handle initial selection
  React.useEffect(() => {
    if (initialSelectedFile && treeRef.current && treeData.length > 0) {
      // Attempt selection only if data is available
      const node = treeRef.current.get(initialSelectedFile);
      if (node) {
        treeRef.current.select(initialSelectedFile);
        // Open parent folders
        treeRef.current.openParents(initialSelectedFile);
        // Scroll to selection with a small delay
        setTimeout(() => {
          treeRef.current?.scrollTo(initialSelectedFile);
        }, 200);
      }
    }
  }, [initialSelectedFile, treeData]);

  // Effect to measure container height
  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(element.offsetHeight);
    });

    // Initial measurement
    setContainerHeight(element.offsetHeight);

    // Start observing
    resizeObserver.observe(element);

    // Cleanup
    return () => resizeObserver.unobserve(element);
  }, []);

  // Filter files based on search term
  const filteredTree = React.useMemo(() => {
    if (!searchTerm) return treeData;
    // ...filterNodes logic as in your inspiration code...
    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.reduce((acc: TreeNode[], node) => {
        const nameMatch = node.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        let filteredChildren: TreeNode[] | undefined = undefined;
        if (node.children && node.children.length > 0) {
          filteredChildren = filterNodes(node.children);
        }
        if (nameMatch || (filteredChildren && filteredChildren.length > 0)) {
          const newNode = {
            ...node,
            children: filteredChildren,
          };
          if (!node.isLeaf && !expandedFolders.includes(node.id)) {
            setExpandedFolders((prev) => [...prev, node.id]);
          }
          acc.push(newNode);
        }
        return acc;
      }, []);
    };
    return filterNodes(treeData);
  }, [treeData, searchTerm, expandedFolders]);

  // Function to expand/collapse all folders
  const toggleAllFolders = (expand: boolean) => {
    if (expand) {
      const getAllFolderIds = (nodes: TreeNode[]): string[] => {
        return nodes.reduce((acc: string[], node) => {
          if (!node.isLeaf) {
            acc.push(node.id);
            if (node.children) {
              acc = [...acc, ...getAllFolderIds(node.children)];
            }
          }
          return acc;
        }, []);
      };
      const allFolderIds = getAllFolderIds(treeData);
      setExpandedFolders(allFolderIds);
      if (treeRef.current) {
        allFolderIds.forEach((id) => {
          treeRef.current?.open(id);
        });
      }
    } else {
      setExpandedFolders([]);
      if (treeRef.current) {
        treeRef.current.closeAll();
      }
    }
  };

  if (!filePaths || filePaths.length === 0) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
        No files to preview.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900/40 rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700"
    >
      {/* Search and controls bar */}
      <div className="flex items-center px-2 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card/50">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          <svg
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => toggleAllFolders(true)}
            className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded"
            title="Expand all folders"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => toggleAllFolders(false)}
            className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded"
            title="Collapse all folders"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 12H4"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Tree area */}
      <div className="flex-grow relative overflow-hidden">
        {filteredTree.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center"
          >
            {searchTerm
              ? "No matching files found."
              : "Processing file structure..."}
          </motion.div>
        )}

        {containerHeight > 0 && filteredTree.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="tree-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Tree<TreeNode>
                ref={treeRef}
                data={filteredTree}
                width="100%"
                height={containerHeight - 42} // Subtract search bar height
                children={Node}
                rowHeight={32}
                indent={22}
                paddingTop={8}
                paddingBottom={12}
                openByDefault={searchTerm.length > 0}
                onActivate={(node) => {
                  if (node.isLeaf) {
                    onSelectFile(node.id);
                  } else {
                    node.toggle();
                    setExpandedFolders((prev) =>
                      node.isOpen
                        ? [...prev, node.id]
                        : prev.filter((id) => id !== node.id)
                    );
                  }
                }}
                className="transition-all duration-200"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
            {filteredTree.length === 0
              ? "No files match your search."
              : "Measuring tree height..."}
          </div>
        )}
      </div>

      {/* Status bar with file count */}
      <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50">
        {filePaths.length} {filePaths.length === 1 ? "file" : "files"}
        {searchTerm && filteredTree.length > 0 && (
          <span>
            {" "}
            • {filteredTree.length}{" "}
            {filteredTree.length === 1 ? "result" : "results"}
          </span>
        )}
      </div>
    </div>
  );
}

export default FileTree;
