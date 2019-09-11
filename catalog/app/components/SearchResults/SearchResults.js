import cx from 'classnames'
import * as R from 'ramda'
import * as React from 'react'
import * as M from '@material-ui/core'

import BreadCrumbs, { Crumb } from 'components/BreadCrumbs'
import * as Preview from 'components/Preview'
import AsyncResult from 'utils/AsyncResult'
import * as AWS from 'utils/AWS'
import * as NamedRoutes from 'utils/NamedRoutes'
import StyledLink, { linkStyle } from 'utils/StyledLink'
import { getBreadCrumbs } from 'utils/s3paths'
import { readableBytes } from 'utils/string'

function Crumbs({ handle: { bucket, key, version }, showBucket = false }) {
  const { urls } = NamedRoutes.use()
  const crumbs = getBreadCrumbs(key).map(({ label, path: segPath }) =>
    Crumb.Segment({
      label,
      to:
        // eslint-disable-next-line no-nested-ternary
        segPath === key
          ? version
            ? urls.bucketFile(bucket, segPath, version)
            : undefined
          : urls.bucketDir(bucket, segPath),
    }),
  )
  if (showBucket) {
    crumbs.unshift(Crumb.Segment({ label: bucket, to: urls.bucketRoot(bucket) }))
  }

  // TODO: remove space when copying path
  const items = R.intersperse(Crumb.Sep(' / '), crumbs)
  return <BreadCrumbs items={items} />
}

function Header({ handle, showBucket }) {
  const getUrl = AWS.Signer.useS3Signer()
  // TODO: handle null version
  return (
    <M.Box display="flex" mb={1}>
      <Crumbs {...{ handle, showBucket }} />
      <M.Box flexGrow={1} />
      {handle.version ? (
        <M.Box
          alignItems="center"
          display="flex"
          height={32}
          justifyContent="center"
          width={24}
        >
          <M.IconButton href={getUrl(handle)} title="Download" download>
            <M.Icon>arrow_downward</M.Icon>
          </M.IconButton>
        </M.Box>
      ) : (
        <M.Chip label="DELETED" />
      )}
    </M.Box>
  )
}

const Section = ({ children }) => <M.Box mt={2}>{children}</M.Box>

const SectionHeading = ({ children, ...props }) => (
  <M.Typography variant="h6" {...props}>
    {children}
  </M.Typography>
)

const useVersionInfoStyles = M.makeStyles((t) => ({
  versionContainer: {
    color: t.palette.text.secondary,
    fontWeight: t.typography.fontWeightLight,
  },
  version: {
    fontFamily: t.typography.monospace.fontFamily,
    fontWeight: t.typography.fontWeightMedium,
  },
  bold: {
    color: t.palette.text.primary,
    fontWeight: t.typography.fontWeightRegular,
  },
  seeOther: {
    borderBottom: '1px dashed',
    cursor: 'pointer',
    ...linkStyle,
  },
}))

function VersionInfo({ bucket, path, version, versions }) {
  const classes = useVersionInfoStyles()
  const { urls } = NamedRoutes.use()
  const [versionsShown, setVersionsShown] = React.useState(false)
  const toggleVersions = React.useCallback(() => {
    setVersionsShown(!versionsShown)
  }, [setVersionsShown, versionsShown])

  return (
    <>
      <M.Typography variant="subtitle1" className={classes.versionContainer}>
        {version.id ? (
          <span>
            {'Version '}
            <StyledLink
              to={urls.bucketFile(bucket, path, version.id)}
              className={classes.version}
            >
              {version.id}
            </StyledLink>
            {' from '}
            <span className={classes.bold}>{version.updated.toLocaleString()}</span>
            {' | '}
            <span className={classes.bold}>{readableBytes(version.size)}</span>
          </span>
        ) : (
          <span>
            <span className={classes.bold}>Deleted</span>
            {' on '}
            <span className={classes.bold}>{version.updated.toLocaleString()}</span>
          </span>
        )}
      </M.Typography>
      {versions.length > 1 && (
        <M.Typography>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <span className={classes.seeOther} onClick={toggleVersions}>
            {versionsShown ? 'hide ' : 'show '} all versions ({versions.length})
          </span>
        </M.Typography>
      )}
      {versions.length > 1 && versionsShown && (
        <Section>
          <SectionHeading gutterBottom>Versions ordered by relevance</SectionHeading>
          {versions.map((v) => (
            <M.Typography
              key={`${v.updated.getTime()}:${v.id}`}
              variant="body2"
              className={classes.versionContainer}
            >
              {v.id ? (
                <span>
                  <StyledLink
                    to={urls.bucketFile(bucket, path, v.id)}
                    className={classes.version}
                  >
                    {v.id}
                  </StyledLink>
                  {' from '}
                  <span className={classes.bold}>{v.updated.toLocaleString()}</span>
                  {' | '}
                  <span className={classes.bold}>{readableBytes(v.size)}</span>
                </span>
              ) : (
                <span>
                  <span className={classes.bold}>Deleted</span>
                  {' on '}
                  <span className={classes.bold}>{v.updated.toLocaleString()}</span>
                </span>
              )}
            </M.Typography>
          ))}
        </Section>
      )}
    </>
  )
}

const usePreviewBoxStyles = M.makeStyles((t) => ({
  root: {
    border: `1px solid ${t.palette.grey[300]}`,
    borderRadius: t.shape.borderRadius,
    maxHeight: t.spacing(30),
    marginTop: t.spacing(1),
    minHeight: t.spacing(15),
    padding: t.spacing(2),
    position: 'relative',

    '& img': {
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    // workarounds to speed-up notebook preview rendering:
    '&:not($expanded)': {
      // hide overflow only when not expanded, using this while expanded
      // slows down the page in chrome
      overflow: 'hidden',

      // only show 2 first cells unless expanded
      '& .ipynb-preview .cell:nth-child(n+3)': {
        display: 'none',
      },
    },
  },
  expanded: {
    maxHeight: 'none',
  },
  fade: {
    alignItems: 'flex-end',
    background:
      'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0.9), rgba(255,255,255,0))',
    bottom: 0,
    display: 'flex',
    height: t.spacing(10),
    justifyContent: 'center',
    left: 0,
    padding: t.spacing(1),
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
}))

function PreviewBox({ data }) {
  const classes = usePreviewBoxStyles()
  const [expanded, setExpanded] = React.useState(false)
  const expand = React.useCallback(() => {
    setExpanded(true)
  }, [setExpanded])
  return (
    <div className={cx(classes.root, { [classes.expanded]: expanded })}>
      {Preview.render(data)}
      {!expanded && (
        <div className={classes.fade}>
          <M.Button variant="outlined" onClick={expand}>
            Expand
          </M.Button>
        </div>
      )}
    </div>
  )
}

function PreviewDisplay({ handle }) {
  if (!handle.version) return null
  return (
    <Section>
      <SectionHeading>Preview</SectionHeading>
      {Preview.load(
        handle,
        AsyncResult.case({
          Ok: AsyncResult.case({
            Init: (_, { fetch }) => (
              <M.Typography variant="body1">
                Large files are not previewed by default{' '}
                <M.Button variant="outlined" size="small" onClick={fetch}>
                  Load preview
                </M.Button>
              </M.Typography>
            ),
            Pending: () => <M.CircularProgress />,
            Err: (_, { fetch }) => (
              <M.Typography variant="body1">
                Error loading preview{' '}
                <M.Button variant="outlined" size="small" onClick={fetch}>
                  Retry
                </M.Button>
              </M.Typography>
            ),
            Ok: (data) => <PreviewBox data={data} />,
          }),
          Err: () => <M.Typography variant="body1">Preview not available</M.Typography>,
          _: () => <M.CircularProgress />,
        }),
      )}
    </Section>
  )
}

function Meta({ meta }) {
  if (!meta || R.isEmpty(meta)) return null
  return (
    <Section>
      <SectionHeading>Metadata</SectionHeading>
      <M.Box
        component="pre"
        bgcolor={M.colors.lightBlue[50]}
        borderColor={M.colors.lightBlue[400]}
        mb={0}
        mt={1}
        style={{ opacity: 0.7 }}
      >
        {JSON.stringify(meta, null, 2)}
      </M.Box>
    </Section>
  )
}

const getDefaultVersion = (versions) => versions.find((v) => !!v.id) || versions[0]

export function Hit({ showBucket, hit: { path, versions, bucket } }) {
  const v = getDefaultVersion(versions)
  return (
    <M.Box component={M.Card} mb={2}>
      <M.CardContent>
        <Header handle={{ bucket, key: path, version: v.id }} showBucket={showBucket} />
        <VersionInfo bucket={bucket} path={path} version={v} versions={versions} />
        <Meta meta={v.meta} />
        <PreviewDisplay handle={{ bucket, key: path, version: v.id }} />
      </M.CardContent>
    </M.Box>
  )
}
