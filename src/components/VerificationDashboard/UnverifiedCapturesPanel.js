import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import OptimizedImage from '../OptimizedImage';
import { useRecentUnverifiedCaptures, RECENT_CAPTURE_COUNT } from './data';

const THUMBNAIL_SIZE = 46;

const usePanelStyles = makeStyles((theme) => ({
  panel: {
    padding: theme.spacing(6),
    borderRadius: '10px',
    height: '100%',
    boxSizing: 'border-box',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
    paddingBlockEnd: theme.spacing(3),
  },
  panelSub: {
    color: theme.palette.stats.carbonGrey,
  },
  emptyState: {
    color: theme.palette.stats.carbonGrey,
    paddingBlock: theme.spacing(4),
  },
  captureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: `${theme.spacing(3)}px 0`,
    borderBottom: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  captureThumb: {
    position: 'relative',
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    flex: 'none',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: theme.palette.stats.lavenderPinocchio,
  },
  captureMeta: {
    minWidth: 0,
    flex: 1,
  },
  captureId: {
    fontWeight: 700,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  captureSub: {
    color: theme.palette.stats.carbonGrey,
  },
  captureWhen: {
    color: theme.palette.stats.carbonGrey,
    whiteSpace: 'nowrap',
  },
}));

function UnverifiedCapturesPanel() {
  const classes = usePanelStyles();

  const { data: captures, isLoading, isError } = useRecentUnverifiedCaptures();

  return (
    <Paper elevation={3} className={classes.panel}>
      <Box className={classes.panelHeader}>
        <Typography variant="h6">Unverified captures</Typography>
        <Typography variant="body2" className={classes.panelSub}>
          Recent {RECENT_CAPTURE_COUNT} captures
        </Typography>
      </Box>

      {isLoading && <CircularProgress size={'32px'} />}

      {isError && (
        <Typography variant="body1" className={classes.emptyState}>
          Could not load unverified captures. Try again later.
        </Typography>
      )}

      {!isLoading && !isError && captures?.length === 0 && (
        <Typography variant="body1" className={classes.emptyState}>
          Nothing is waiting to be verified.
        </Typography>
      )}

      {!isLoading &&
        !isError &&
        captures?.map((capture) => (
          <Box key={capture.id} className={classes.captureRow}>
            <div className={classes.captureThumb}>
              <OptimizedImage
                src={capture.imageUrl}
                width={THUMBNAIL_SIZE}
                height={THUMBNAIL_SIZE}
                fixed
                alertHeight={THUMBNAIL_SIZE}
                alertWidth={THUMBNAIL_SIZE}
              />
            </div>
            <div className={classes.captureMeta}>
              <Typography variant="body1" className={classes.captureId}>
                {capture.uuid || capture.id}
              </Typography>
              {capture.planterIdentifier && (
                <Typography variant="body2" className={classes.captureSub}>
                  {capture.planterIdentifier}
                </Typography>
              )}
            </div>
            {capture.timeCreated && (
              <Typography variant="body2" className={classes.captureWhen}>
                {formatDistanceToNow(new Date(capture.timeCreated), {
                  addSuffix: true,
                })}
              </Typography>
            )}
          </Box>
        ))}
    </Paper>
  );
}

export default UnverifiedCapturesPanel;
