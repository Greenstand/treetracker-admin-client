import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Person from '@material-ui/icons/Person';
import LinkToWebmap from './common/LinkToWebmap';
import OptimizedImage from './OptimizedImage';
import { AppContext } from '../context/AppContext.js';
import { getOrganizationById } from 'utilities/index.js';
import { useStyle, GROWER_IMAGE_SIZE } from './Growers/Growers.styles.js';

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
          props.placeholder && classes.placeholderCard,
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
          <Grid justify="flex-start" container>
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
              />
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};

export default Grower;

/**
 * @function
 * @name GrowerOrganization
 * @description display organision associated with the grower
 *
 * @param {object} props
 * @param {string} props.organizationName name of organization grower belongs to
 * @param {number} props.assignedOrganizationId id of organization assigned to grower
 *
 * @returns {React.Component}
 */
const GrowerOrganization = (props) => {
  const appContext = useContext(AppContext);
  const { organizationName, assignedOrganizationId } = props;

  const renderGrowerOrganization = () => (
    <Typography style={{ color: '#C0C0C0', fontStyle: 'italic' }}>
      {organizationName}
    </Typography>
  );
  const renderGrowerAssignedOrganization = (id) => {
    const assignedOrganization = getOrganizationById(appContext.orgList, id);
    return (
      <Typography>
        {assignedOrganization?.name} ({id})
      </Typography>
    );
  };

  return assignedOrganizationId
    ? renderGrowerAssignedOrganization(assignedOrganizationId)
    : organizationName
    ? renderGrowerOrganization()
    : '';
};

GrowerOrganization.propTypes = {
  organizationName: PropTypes.string,
};
GrowerOrganization.defaultProps = {
  organizationName: null,
};
