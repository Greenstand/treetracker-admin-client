import { WorkerVerification } from './ContractActions';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDomain, useDomainData } from './DomainContext';
import GrowerTransfer from './GrowerTransfer';
import { QueryState, Status, dateTime, safeUrl } from './shared';
export default function GrowerAccount({ growerId, organizationId, onClose }) {
  const domain = useDomain();
  const canVerify =
    domain.platform || domain.permissions?.includes('verify_captures');
  const wholeProfile = domain.platform && domain.viewMode !== 'organization';
  const profileOrganization = wholeProfile ? undefined : organizationId;
  const [moving, setMoving] = useState(false);
  const [notice, setNotice] = useState('');
  const query = useDomainData(
    '/growers/' + growerId,
    { organizationId: profileOrganization },
    true,
    wholeProfile || Boolean(organizationId)
  );
  const sessions = useDomainData(
    '/sessions',
    { growerId, size: 25, organizationId: profileOrganization },
    true,
    wholeProfile || Boolean(organizationId)
  );
  const grower = query.data;
  const name =
    grower && [grower.first_name, grower.last_name].filter(Boolean).join(' ');
  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{name || 'Grower account'}</DialogTitle>
      <DialogContent dividers>
        <QueryState query={query} />
        {notice && <Alert severity="success">{notice}</Alert>}
        {grower && (
          <>
            <Box display="flex" alignItems="center" mb={3} style={{ gap: 16 }}>
              <Avatar
                src={safeUrl(grower.image_url)}
                alt={name || 'Grower'}
                style={{ width: 64, height: 64 }}
              />
              <Box>
                <Typography variant="h6">
                  {name || 'Name unavailable'}
                </Typography>
                <Typography color="textSecondary">
                  {grower.organization_name || 'No organization recorded'}
                </Typography>
                <Status value={grower.status} />
              </Box>
            </Box>
            <Grid container spacing={3}>
              {[
                ['Phone', grower.phone],
                ['Email', grower.email],
                ['Wallet', grower.wallet],
                [
                  'Registered',
                  dateTime(grower.first_registration_at || grower.created_at),
                ],
                ['App version (last upload)', grower.app_version],
                ['Last upload', dateTime(grower.last_upload_at)],
              ].map(([label, value]) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography variant="caption" color="textSecondary">
                    {label}
                  </Typography>
                  <Typography style={{ overflowWrap: 'anywhere' }}>
                    {value || 'Unavailable'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            {grower.about && (
              <Box my={3}>
                <Typography>{grower.about}</Typography>
              </Box>
            )}
            <Box mt={4}>
              {wholeProfile && <WorkerVerification growerId={grower.id} />}
              <Typography variant="h6">Projects</Typography>
              {!grower.projects.length ? (
                <Typography color="textSecondary">
                  No project associations are recorded for this grower in the
                  available scope.
                </Typography>
              ) : (
                <Table size="small" aria-label="Grower projects">
                  <TableHead>
                    <TableRow>
                      {['Project', 'Organization', 'Association', 'Status'].map(
                        (x) => (
                          <TableCell key={x}>{x}</TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grower.projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          {project.name}
                          <Typography variant="caption" display="block">
                            {project.code} {project.country || ''}
                          </Typography>
                        </TableCell>
                        <TableCell>{project.organization_name}</TableCell>
                        <TableCell>
                          {project.left_at
                            ? 'Former assignment'
                            : project.association}
                        </TableCell>
                        <TableCell>
                          <Status value={project.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {grower.projectsLimited && (
                <Alert severity="info">
                  Showing the first 100 project associations.
                </Alert>
              )}
            </Box>
            <Box mt={4}>
              <Typography variant="h6">Tracking sessions</Typography>
              <QueryState query={sessions} />
              {sessions.data?.rows.length === 0 && (
                <Typography color="textSecondary">
                  No linked sessions recorded in this scope.
                </Typography>
              )}
              {Boolean(sessions.data?.rows.length) && (
                <Table size="small" aria-label="Grower sessions">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start (UTC)</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Captures</TableCell>
                      <TableCell>Review</TableCell>
                      <TableCell>Verification</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.data.rows.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {dateTime(
                            session.start_time || session.first_capture
                          )}
                        </TableCell>
                        <TableCell>
                          {session.organization_name || 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          {session.project_name || 'No project'}
                        </TableCell>
                        <TableCell>{session.capture_count}</TableCell>
                        <TableCell>
                          <Status value={session.review_status} />
                        </TableCell>
                        <TableCell>
                          <Button
                            component={Link}
                            size="small"
                            color="primary"
                            to={
                              '/verify?sessionId=' +
                              encodeURIComponent(session.id)
                            }
                            aria-label={'Verify session ' + session.id}
                            disabled={
                              !canVerify || Number(session.capture_count) === 0
                            }
                            onClick={onClose}
                          >
                            Verify session
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {sessions.data?.hasNext && (
                <Typography variant="caption">
                  Showing the first 25 sessions. Use Tracking Sessions to browse
                  more.
                </Typography>
              )}
            </Box>
          </>
        )}
      </DialogContent>
      {moving && grower && (
        <GrowerTransfer
          grower={grower}
          onClose={() => setMoving(false)}
          onMoved={(result) => {
            setMoving(false);
            setNotice(
              result.membershipOnly
                ? 'Membership saved. No sessions or captures were transferred.'
                : `Allocation saved: ${
                    result.allocatedSessions || 0
                  } sessions, ${
                    result.allocatedRawCaptures || 0
                  } raw captures and ${
                    result.allocatedCaptures || 0
                  } processed captures. Raw and processed counts may overlap.`
            );
          }}
        />
      )}
      <DialogActions>
        {grower && domain.platform && domain.viewMode !== 'organization' && (
          <Button color="primary" onClick={() => setMoving(true)}>
            Move organization / history
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
