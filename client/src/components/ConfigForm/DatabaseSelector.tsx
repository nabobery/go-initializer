import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useConfigStore } from '../../store/useConfigStore';

type DatabaseOption = 'postgres' | 'mysql' | 'sqlite' | 'mongodb' | 'none' | '';

function DatabaseSelector() {
    const database = useConfigStore((state) => state.database);
    const setDatabase = useConfigStore((state) => state.setDatabase);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDatabase((event.target as HTMLInputElement).value as DatabaseOption);
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Database</FormLabel>
            <RadioGroup
                aria-label="database"
                name="database-radio-buttons-group"
                value={database}
                onChange={handleChange}
            >
                {/* Group SQL DBs for clarity maybe? */}
                <FormControlLabel value="none" control={<Radio />} label="None" />
                <FormControlLabel value="postgres" control={<Radio />} label="PostgreSQL (GORM)" />
                <FormControlLabel value="mysql" control={<Radio />} label="MySQL (GORM)" />
                <FormControlLabel value="sqlite" control={<Radio />} label="SQLite (GORM)" />
                <FormControlLabel value="mongodb" control={<Radio />} label="MongoDB (Driver)" />
            </RadioGroup>
        </FormControl>
    );
}

export default DatabaseSelector;