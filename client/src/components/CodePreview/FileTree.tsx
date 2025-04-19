import React from "react";
import { Tree, NodeRendererProps, TreeApi } from "react-arborist";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";

// Define the structure for tree nodes expected by react-arborist
interface TreeNode {
  id: string; // Unique ID (full path)
  name: string; // Display name (file/folder name)
  children?: TreeNode[];
  isLeaf: boolean;
}

// Custom Node Renderer for icons and styling (defined outside FileTree)
const Node: React.FC<NodeRendererProps<TreeNode>> = ({
  node,
  style, // Provided by react-arborist, includes indentation etc.
  dragHandle,
}) => {
  const Icon = node.isLeaf ? DocumentIcon : FolderIcon;
  return (
    <div
      ref={dragHandle}
      style={style}
      className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded transition-colors duration-150 select-none
        ${
          node.state.isSelected
            ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-200"
            : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
        }
      `}
      // onClick={(e) => node.handleClick(e)}
      // The Tree's onActivate prop will handle the click logic now
    >
      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-colors duration-150" />
      <span className="truncate text-sm font-medium transition-colors duration-150">
        {node.data.name}
      </span>
      {/* Add indicator for open/closed state */}
      {!node.isLeaf && (
        <span className="ml-auto text-xs text-gray-400">
          {node.state.isOpen ? '▼' : '►'}
        </span>
      )}
    </div>
  );
};

// Helper to build the tree structure
function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode = {
    id: "__root__",
    name: "root",
    children: [],
    isLeaf: false,
  }; // Temporary root
  const map: Record<string, TreeNode> = { "": root }; // Map paths to nodes, parent of root elements is ""

  // Sort paths to ensure parent directories are processed implicitly before their contents
  // when iterating through parts of a path.
  paths.sort();

  for (const path of paths) {
    const parts = path.split("/");
    let parentPath = ""; // Track the path of the parent node

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Construct the full path for the current part
      const currentPath = parentPath ? `${parentPath}/${part}` : part;
      // Determine if this specific part is the end of the *current* full path string
      const isLeafNode = i === parts.length - 1;

      let currentNode = map[currentPath];

      // --- Start of Revised Logic ---
      if (!currentNode) {
        // 1. Node doesn't exist, create it
        currentNode = {
          id: currentPath, // Use the full path as the unique ID
          name: part,      // Display name is just the file/folder name
          isLeaf: isLeafNode,
          // Initialize children array ONLY if it's potentially a directory
          children: isLeafNode ? undefined : [],
        };
        map[currentPath] = currentNode; // Add the new node to our map

        // 2. Add the new node to its parent's children list
        const parentNode = map[parentPath]; // Parent is guaranteed to exist in map due to loop/sort order
        // Ensure parent exists and has a children array (it should, if it's a directory)
        if (parentNode && parentNode.children) {
           // Prevent duplicates (less likely with sort, but safe)
           if (!parentNode.children.some(child => child.id === currentNode!.id)) {
               parentNode.children.push(currentNode);
           }
        }
      } else {
        // 3. Node already exists (it must be a directory encountered before)
        // If we are currently processing this path segment and it's *not* the
        // final part (i.e., it's definitely a directory in this path context),
        // ensure its properties reflect that.
        if (!isLeafNode) {
          currentNode.isLeaf = false; // Ensure it's marked as a directory
          if (!currentNode.children) {
            // Ensure it has a children array if it somehow doesn't
            currentNode.children = [];
          }
        }
         // If the node already exists, we don't need to add it to its parent again.
      }
      // --- End of Revised Logic ---

      // Update parentPath for the next iteration
      parentPath = currentPath;
    }
  }

  // Return the children of the temporary root node
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
  const containerRef = React.useRef<HTMLDivElement>(null); // Ref for the container div
  const [containerHeight, setContainerHeight] = React.useState(0); // State for measured height

  React.useEffect(() => {
    if (initialSelectedFile && treeRef.current && treeData.length > 0) {
      // Attempt selection only if data is available
      const node = treeRef.current.get(initialSelectedFile);
      if (node) {
        treeRef.current.select(initialSelectedFile);
        // Optionally open parents
        // treeRef.current.openParents(initialSelectedFile);
        // Optionally scroll to selection
        // treeRef.current.scrollTo(initialSelectedFile);
      }
    }
  }, [initialSelectedFile, treeData]); // Re-run when initialSelectedFile or treeData changes



  // Effect to measure container height
  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // const resizeObserver = new ResizeObserver(entries => {
    //   // We only expect one entry for the observed element
    //   for (const entry of entries) {
    //     // Use entry.contentRect for height excluding padding/border if needed,
    //     // or element.offsetHeight for total height. Let's use offsetHeight
    //     // as it typically corresponds to the layout height.
    //     setContainerHeight(element.offsetHeight);
    //   }
    // });

    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(element.offsetHeight);
    });

    // Initial measurement
    setContainerHeight(element.offsetHeight);

    // Start observing
    resizeObserver.observe(element);

    // Cleanup
    return () => resizeObserver.unobserve(element);
  }, [filePaths]); // Re-measure if filePaths structure changes? Or maybe just []? Let's start with []


  if (!filePaths || filePaths.length === 0) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
        No files to preview.
      </div>
    );
  }

  // const treeHeight =
  // typeof height === "string"
  //   ? (height.includes("%") ? height : parseInt(height.replace(/px|vh/g, "")) || 400)
  //   : height;

  // console.log(treeHeight);

  return (
    <div ref={containerRef} className="h-full w-full border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-2 rounded-lg overflow-hidden">
      {treeData.length === 0 && (
        <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
          Processing file structure...
        </div>
      )}
      {containerHeight > 0 && treeData.length > 0 ? (
        <Tree<TreeNode>
          ref={treeRef}
          data={treeData}
          width={"100%"} // Width can remain percentage as it's CSS style
          height={containerHeight} // Use the measured numerical height
          children={Node}
          rowHeight={32}
          indent={22}
          paddingTop={8}
          paddingBottom={12}
          openByDefault={false}
          onActivate={(node) => {
            if (node.isLeaf) {
              onSelectFile(node.id);
            } else {
              node.toggle();
            }
          }}
          className="transition-all duration-200"
        />
      ) : (
        // Show loading/processing state if height is not measured or no data
        <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
          {treeData.length === 0
            ? "Processing file structure..."
            : "Measuring tree height..."}
        </div>
      )}
    </div>
  );
}

export default FileTree;
