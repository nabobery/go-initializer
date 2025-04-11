import { Paper, Typography, Button, Box } from '@mui/material';
import FrameworkSelector from '../components/ConfigForm/FrameworkSelector';
import DatabaseSelector from '../components/ConfigForm/DatabaseSelector';
import FeatureSelector from '../components/ConfigForm/FeatureSelector';
import MetadataInput from '../components/ConfigForm/MetadataInput';
import { useConfigStore } from '../store/useConfigStore';
// Import API service and download logic in Phase 4
// Import Preview component in Phase 6

function HomePage() {
    const config = useConfigStore((state) => state); // Get all state for sending to backend
    const { goVersion } = useConfigStore(); // Get specific ones for display/buttons
    // Add loading/error state for API calls later

    const handleDownload = () => {
        console.log('Downloading with config:', config);
        // TODO: Call backend API in Phase 4
    };

    const handlePreview = () => {
        console.log('Previewing with config:', config);
        // TODO: Call backend API in Phase 6
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Typography variant="h4" gutterBottom>
                Configure your Go Project
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Go Version: {goVersion} (Latest Stable)
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Left Side: Configuration Options */}
                <div className="flex flex-col gap-4">
                    <Paper className="p-4 flex flex-col gap-4">
                        <MetadataInput />
                        <FrameworkSelector />
                        <DatabaseSelector />
                        <FeatureSelector />
                    </Paper>
                </div>

                {/* Right Side: Preview & Actions */}
                <div className="flex flex-col gap-4">
                    <Paper className="p-4 flex flex-col h-full">
                        {/* Code Preview Area (Phase 6) */}
                        <Box className="flex-grow border border-dashed border-gray-400 p-2 mb-4 overflow-auto">
                            <Typography color="text.secondary">Code Preview Area</Typography>
                            {/* Add Monaco Editor / File Tree here */}
                        </Box>

                        <Box className="flex justify-between gap-4">
                            <Button variant="outlined" onClick={handlePreview}>
                                Preview Code
                            </Button>
                            <Button variant="contained" onClick={handleDownload}>
                                Generate & Download .ZIP
                            </Button>
                        </Box>
                        {/* Add error display area */}
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
