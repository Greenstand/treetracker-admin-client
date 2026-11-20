import React from 'react';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDomainData } from './DomainContext';
import { DomainPage, Metric, QueryState, dateTime } from './shared';
export default function Dashboard() {
  const query = useDomainData('/dashboard');
  const data = query.data || {};
  return (
    <DomainPage title="Dashboard">
      <QueryState query={query} />
      <Grid container spacing={4}>
        <Metric title="Projects" value={data.projects}>
          <Button component={Link} to="/projects">
            Manage projects
          </Button>
        </Metric>
        <Metric title="Growers" value={data.growers}>
          <Button component={Link} to="/growers">
            View growers
          </Button>
        </Metric>
        <Metric title="Captures" value={data.captures}>
          <Button component={Link} to="/captures">
            View captures
          </Button>
        </Metric>
        <Metric title="Tracking sessions" value={data.sessions}>
          <Button component={Link} to="/tracking-sessions">
            View sessions
          </Button>
        </Metric>
      </Grid>
      <Box mt={5}>
        <Paper variant="outlined">
          <Box p={5}>
            <Typography component="h2" variant="h6">
              Recent capture uploads
            </Typography>
            <List>
              {(data.activity || []).map((row) => (
                <ListItem key={row.id} divider>
                  <ListItemText
                    primary={row.grower_name || 'Grower name unavailable'}
                    secondary={
                      dateTime(row.created_at) +
                      ' UTC · ' +
                      (row.tree_id ? 'Matched to tree' : 'Awaiting matching')
                    }
                  />
                </ListItem>
              ))}
            </List>
            {!query.isFetching && !query.error && !data.activity?.length && (
              <Typography color="textSecondary">No recent captures.</Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </DomainPage>
  );
}
