import { useLocation } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent
} from '@mui/material';

export const People = () => {

    const location = useLocation();

    const { label } = location.state || {};

    return (
        <Card>
            <CardHeader
                title={label}
            />
            <CardContent>
            </CardContent>
        </Card>
    );
};