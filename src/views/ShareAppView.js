import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Link,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Close as CloseIcon,
  FileCopy as CopyIcon,
  GetApp as DownloadIcon,
} from '@material-ui/icons';
import { QRCodeCanvas } from 'qrcode.react';

import { AppContext } from 'context/AppContext';
import { getOrganizationById } from 'api/organizations';
import { buildShareAppLink } from 'common/shareLink';
import AppLayout from 'components/common/AppLayout';
import Spinner from 'components/common/Spinner';
import { documentTitle } from 'common/variables';

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: '100vh',
    backgroundColor: theme.palette.primary.lightVery,
  },
  content: {
    flexGrow: 1,
    minWidth: 0,
    padding: theme.spacing(10),
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(4) },
  },
  pageHeader: {
    marginBottom: theme.spacing(6),
  },
  pageTitle: {
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    maxWidth: 640,
  },
  card: {
    width: '100%',
    maxWidth: 1080,
    borderRadius: theme.spacing(3),
    border: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    overflow: 'hidden',
  },
  cardGrid: {
    minHeight: 360,
  },
  // Left column: link
  leftCol: {
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(6) },
  },
  columnDivider: {
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 700,
    fontSize: '0.7rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  helperText: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    lineHeight: 1.5,
  },
  linkField: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(3, 4),
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    backgroundColor: theme.palette.common.white,
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
    '&:hover': {
      borderColor: theme.palette.primary.lightMed,
    },
  },
  link: {
    overflowWrap: 'anywhere',
    fontSize: '0.95rem',
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
  copyButton: {
    marginTop: theme.spacing(4),
    alignSelf: 'flex-start',
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    fontWeight: 700,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    boxShadow: 'none',
    '&:hover': { boxShadow: 'none' },
  },
  // Right column: QR — text left-aligned to match the link column
  rightCol: {
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.lightVery,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(6),
      borderTop: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    },
  },
  qrCard: {
    display: 'inline-flex',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.stats.lavenderPinocchio}`,
    boxShadow: '0 6px 20px rgba(118, 187, 35, 0.12)',
    marginBottom: theme.spacing(4),
  },
  downloadButton: {
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    fontWeight: 700,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    backgroundColor: theme.palette.common.white,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.lightVery,
      borderColor: theme.palette.primary.main,
    },
  },
  spinnerWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 360,
  },
}));

export default function ShareAppView() {
  const classes = useStyles();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const { user } = useContext(AppContext);
  const organizationId = user?.policy?.organization?.id;

  const qrRef = useRef(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    document.title = `Share App - ${documentTitle}`;
  }, []);

  const { data: organization, isLoading } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => getOrganizationById(organizationId),
    enabled: organizationId !== undefined && organizationId !== null,
  });

  const organizationName = organization?.name || '';
  const shareLink = useMemo(() => {
    return buildShareAppLink({
      name: organizationName,
      id: organizationId,
    });
  }, [organizationName]);

  function showSnackbar(message) {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  async function handleCopy() {
    let message = 'copied';
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      message = 'failed to copy, please try again';
    } finally {
      showSnackbar(message);
    }
  }

  function handleDownload() {
    showSnackbar('Downloading your QR code...');
    const canvas = qrRef.current;
    if (!canvas) return;

    // Export the QR at a fixed 300x300 regardless of the on-screen size.
    const DOWNLOAD_SIZE = 300;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = DOWNLOAD_SIZE;
    exportCanvas.height = DOWNLOAD_SIZE;
    const ctx = exportCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false; // keep QR modules crisp when rescaling
    ctx.drawImage(canvas, 0, 0, DOWNLOAD_SIZE, DOWNLOAD_SIZE);

    const dataUrl = exportCanvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = `treetracker-${organizationId}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  function handleSnackbarClose(event, reason) {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }

  return (
    <AppLayout className={classes.page}>
      <Grid item container direction="column" className={classes.content}>
        <Grid item className={classes.pageHeader}>
          <Typography
            variant={isCompactLayout ? 'h4' : 'h3'}
            className={classes.pageTitle}
          >
            Share App
          </Typography>
          <Typography variant="body1" className={classes.pageSubtitle}>
            Invite planters to your organization by sharing a direct link or
            letting them scan your QR code.
          </Typography>
        </Grid>

        <Grid item>
          <Card elevation={4} className={classes.card}>
            {isLoading ? (
              <Box className={classes.spinnerWrap}>
                <Spinner />
              </Box>
            ) : (
              <Grid container className={classes.cardGrid} alignItems="stretch">
                {/* Left column — share link */}
                <Grid item xs={12} md={6} className={classes.leftCol}>
                  <Typography className={classes.sectionLabel}>
                    Share link
                  </Typography>
                  <Typography variant="h6" className={classes.sectionTitle}>
                    Here is your link to share with your planter
                  </Typography>
                  <Typography variant="body2" className={classes.helperText}>
                    Copy this link and send it directly to your planters so they
                    can join your organization.
                  </Typography>

                  <Box className={classes.linkField}>
                    <Link
                      href={shareLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.link}
                      data-testid="share-app-link"
                    >
                      {shareLink}
                    </Link>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CopyIcon />}
                    onClick={handleCopy}
                    className={classes.copyButton}
                  >
                    copy
                  </Button>
                </Grid>

                <Divider
                  orientation="vertical"
                  flexItem
                  className={classes.columnDivider}
                />

                {/* Right column — QR code */}
                <Grid item xs={12} md className={classes.rightCol}>
                  <Typography className={classes.sectionLabel}>
                    QR code
                  </Typography>
                  <Typography variant="h6" className={classes.sectionTitle}>
                    Here is your QR code to present to your planter
                  </Typography>
                  <Typography variant="body2" className={classes.helperText}>
                    Have your planter scan this code to open the app instantly.
                  </Typography>

                  <Box className={classes.qrCard} data-testid="share-app-qr">
                    <QRCodeCanvas
                      ref={qrRef}
                      value={shareLink}
                      size={200}
                      marginSize={4}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    className={classes.downloadButton}
                  >
                    download your QR code
                  </Button>
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        ContentProps={{ 'data-testid': 'share-app-notification' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </AppLayout>
  );
}
