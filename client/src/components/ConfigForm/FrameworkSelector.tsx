import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useConfigStore } from '../../store/useConfigStore';

function FrameworkSelector() {
    const framework = useConfigStore((state) => state.framework);
    const setFramework = useConfigStore((state) => state.setFramework);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFramework((event.target as HTMLInputElement).value as 'gin' | 'echo');
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Web Framework</FormLabel>
            <RadioGroup
                row
                aria-label="framework"
                name="framework-radio-buttons-group"
                value={framework}
                onChange={handleChange}
            >
                <FormControlLabel value="gin" control={<Radio />} label="Gin" />
                <FormControlLabel value="echo" control={<Radio />} label="Echo" />
            </RadioGroup>
        </FormControl>
    );
}

export default FrameworkSelector;