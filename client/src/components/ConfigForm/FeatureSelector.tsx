import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useConfigStore } from '../../store/useConfigStore';

type FeatureOption = 'logrus' | 'zap' | 'testify';

function FeatureSelector() {
    const features = useConfigStore((state) => state.features);
    const toggleFeature = useConfigStore((state) => state.toggleFeature);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        toggleFeature(event.target.name as FeatureOption);
    };

    return (
        <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Optional Features</FormLabel>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={features.includes('logrus')}
                            onChange={handleChange}
                            name="logrus"
                        />
                    }
                    label="Logrus (Logger)"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={features.includes('zap')}
                            onChange={handleChange}
                            name="zap"
                        />
                    }
                    label="Zap (Logger)"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={features.includes('testify')}
                            onChange={handleChange}
                            name="testify"
                        />
                    }
                    label="Testify (Testing)"
                />
            </FormGroup>
        </FormControl>
    );
}

export default FeatureSelector;