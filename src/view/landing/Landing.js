import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

const Landing = () => {

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h3" component="div" color="common">
                                Lamp Post
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                The lone lamp post of the one-street town flickered, not quite dead but definitely on its way out. Suitcase by her side, she paid no heed to the light, the street or the town. A car was coming down the street and with her arm outstretched and thumb in the air, she had a plan.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={4}>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" color="common" sx={{ textAlign: "center" }}>
                                <Tooltip title="Click to request for IT Support." placement="top-start">
                                    {/* <Button variant="contained" fullWidth={true} color="warning">Open a New Ticket</Button> */}
                                    <Button fullWidth={true} color="warning">Button One</Button>
                                </Tooltip>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" color="common" sx={{ textAlign: "center" }}>
                                <Tooltip title="Click to read solutions to common problems." placement="top">
                                    {/* <Button variant="contained" fullWidth={true} color="info">Knowledge Base</Button> */}
                                    <Button fullWidth={true} color="info">Button Two</Button>
                                </Tooltip>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" color="common" sx={{ textAlign: "center" }}>
                                <Tooltip title="Click to view status of support requests." placement="top-end">
                                    {/* <Button variant="contained" fullWidth={true} color="success">Check Ticket Status</Button> */}
                                    <Button fullWidth={true} color="success">Button Three</Button>
                                </Tooltip>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Landing;