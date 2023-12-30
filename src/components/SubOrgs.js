import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  Collapse,
  FormControlLabel,
  Radio,
  ListItemText,
} from '@material-ui/core';

const SubOrgs = ({ name, id }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const subOrganizations = [
    'Sub-organization1',
    'Sub-organization2',
    'Sub-organization3',
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Paper
          elevation={0}
          style={{
            width: '200px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              cursor: 'pointer',
            }}
          >
            <Typography variant="h6">
              {name} ({id})
            </Typography>
          </div>
          <Collapse in={expanded} style={{ padding: '10px', marginTop: '0' }}>
            <div>
              <List>
                {subOrganizations.map((subOrg, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={subOrg} />
                  </ListItem>
                ))}
              </List>
            </div>
          </Collapse>
        </Paper>
        <div style={{ position: 'relative' }}>
          <FormControlLabel
            control={<Radio checked={expanded} onClick={handleExpandClick} />}
            label="Sub-organization/s"
            style={{
              right: '0',
              position: 'absolute',
              top: '15px',
              left: '-160px',
              display: 'block',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SubOrgs;
