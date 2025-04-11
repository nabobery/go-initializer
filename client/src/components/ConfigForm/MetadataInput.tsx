import { TextField, Box, FormLabel, Typography } from '@mui/material';
import { useConfigStore } from '../../store/useConfigStore';

function MetadataInput() {
    const modulePath = useConfigStore((state) => state.modulePath);
    const projectName = useConfigStore((state) => state.projectName);
    const setModulePath = useConfigStore((state) => state.setModulePath);
    // const setProjectName = useConfigStore((state) => state.setProjectName); // Only set via module path for simplicity now

    const handleModulePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModulePath(event.target.value);
    };

    // Basic validation example - could add more complex regex or feedback
    const isModulePathValid = modulePath && /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)*$/.test(modulePath);


    return (
        <Box>
             <FormLabel component="legend" sx={{ mb: 1}}>Project Metadata</FormLabel>
             <TextField
                required
                fullWidth
                id="module-path"
                label="Go Module Path"
                value={modulePath}
                onChange={handleModulePathChange}
                variant="outlined"
                margin="dense"
                placeholder="e.g., github.com/your-username/your-project"
                error={!isModulePathValid && modulePath.length > 0} // Show error if invalid and not empty
                helperText={!isModulePathValid && modulePath.length > 0 ? "Invalid format (e.g., domain/user/repo)" : "Used for 'go mod init <module-path>'."}
            />
             <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                Project Name (derived): <strong>{projectName || '<Enter Module Path>'}</strong>
            </Typography>
             {/* Optionally allow overriding project name separately */}
             {/* <TextField
                fullWidth
                id="project-name"
                label="Project Name (optional override)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                variant="outlined"
                margin="dense"
            /> */}
        </Box>
    );
}

export default MetadataInput;