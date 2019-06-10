import * as React from 'react'
import { Box, Button, Grid, Typography } from '@material-ui/core'
import { styled } from '@material-ui/styles'

import * as Layout from 'components/Layout'

import Bar from 'website/components/Bar'
import Bullet from 'website/components/Bullet'
import Illustration from 'website/components/Illustration'

import amazon from './amazon.svg'

const Amazon = styled((props) => <img alt="" src={amazon} {...props} />)({
  width: 74,
  height: 74,
  objectFit: 'contain',
  opacity: 0.3,
})

export default () => (
  <Layout.Container position="relative">
    <Box display="flex" flexDirection="column" alignItems="center" pt={10}>
      <Bar color="primary" />
      <Box mt={5}>
        <Typography variant="h1">Why use Quilt?</Typography>
      </Box>
      <Box mt={4} mb={5} maxWidth={570}>
        <Typography variant="body1" color="textSecondary" align="center">
          Quilt makes machine learning data reproducible, auditable, and discoverable by
          providing a central hub for the continuous integration and deployment of data.
          Teams that use Quilt experiment faster, experience less downtime, and deploy
          their data with confidence.
        </Typography>
      </Box>
      <Amazon />
    </Box>
    <Box mt={3}>
      <Grid container>
        <Grid item sm={7}>
          <Illustration
            srcs={[personaScientist, personaScientist2x]}
            dir="left"
            width={843}
            offset={265}
          />
        </Grid>
        <Grid item sm={5}>
          <Box pt={24} pb={15}>
            <Typography variant="h2">Data scientists</Typography>
            <Box mt={6} mb={7}>
              <Bullet color="primary">
                Find any Jupyter notebook you&apos;ve ever touched with powerful search
              </Bullet>
              <Bullet color="tertiary">
                Version and back up everything, including large data that doesn&apos;t fit
                on GitHub
              </Bullet>
              <Bullet color="secondary">Ensure data quality with data unit tests</Bullet>
            </Box>
            <Button variant="contained" color="primary" href="">
              Learn more
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Box>
      <Grid container>
        <Grid item sm={5}>
          <Box pt={32} pb={20}>
            <Typography variant="h2">Data engineers</Typography>
            <Box mt={6} mb={7}>
              <Bullet color="primary">
                Data science infrastructure in a box - no more data busy work for you
              </Bullet>
              <Bullet color="tertiary">
                Insulate code from unintended data changes by building from immutable
                blocks
              </Bullet>
              <Bullet color="secondary">Ensure data quality with data unit tests</Bullet>
            </Box>
            <Button variant="contained" color="secondary" href="">
              Learn more
            </Button>
          </Box>
        </Grid>
        <Grid item sm={7}>
          <Illustration
            srcs={[personaEngineer, personaEngineer2x]}
            dir="right"
            width={730}
            offset={230}
          />
        </Grid>
      </Grid>
    </Box>
    <Box>
      <Grid container>
        <Grid item sm={7}>
          <Illustration
            srcs={[personaHead, personaHead2x]}
            dir="left"
            width={743}
            offset={170}
          />
        </Grid>
        <Grid item sm={5}>
          <Box pt={25} pb={25}>
            <Typography variant="h2">Head of data science</Typography>
            <Box mt={6} mb={7}>
              <Bullet color="primary">Central hub for all data and models</Bullet>
              <Bullet color="tertiary">Audit every data access ever</Bullet>
              <Bullet color="secondary">
                Run your data through a rigorous approval and testing process
              </Bullet>
            </Box>
            <Button variant="contained" color="primary" href="">
              Learn more
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Layout.Container>
)
