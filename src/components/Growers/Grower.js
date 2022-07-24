import React from 'react';
import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Person from '@material-ui/icons/Person';
import LinkToWebmap from '../common/LinkToWebmap';
import OptimizedImage from '../OptimizedImage';
import GrowerOrganization from 'components/GrowerOrganization';
import { useStyle, GROWER_IMAGE_SIZE } from './Growers.styles.js';

export const Grower = (props) => {
  const { grower } = props;
  const classes = useStyle(props);
  return (
    <div
      onClick={() => props.onClick()}
      className={clsx(classes.cardWrapper)}
      key={grower.id}
    >
      <Card
        id={`card_${grower.id}`}
        className={clsx(
          classes.card,
          props.placeholder && classes.placeholderCard
        )}
        classes={{
          root: classes.growerCard,
        }}
      >
        <CardContent className={classes.cardContent}>
          {grower.imageUrl && (
            <OptimizedImage
              src={grower.imageUrl}
              width={GROWER_IMAGE_SIZE}
              height={GROWER_IMAGE_SIZE}
              className={classes.cardMedia}
              fixed
              rotation={grower.imageRotation}
              alertTextSize=".7rem"
              alertTitleSize="1rem"
            />
          )}
          {!grower.imageUrl && (
            <CardMedia className={classes.cardMedia}>
              <Grid container className={classes.personBox}>
                <Person className={classes.person} />
              </Grid>
            </CardMedia>
          )}
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Grid justifyContent="flex-start" container>
            <Grid container direction="column">
              <Typography className={classes.name}>
                {grower.firstName} {grower.lastName}
              </Typography>
              <Typography>
                ID: <LinkToWebmap value={grower.id} type="user" />
              </Typography>
              <GrowerOrganization
                organizationName={grower?.organization}
                assignedOrganizationId={grower?.organizationId}
                compact={true}
              />
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};

export default Grower;
