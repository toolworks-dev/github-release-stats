import { useState } from 'react'
import { Container, Paper, TextField, Button, Typography, Box, Card, Chip, Stack } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Download, GitHub } from '@mui/icons-material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#242424'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          margin: 0,
          padding: 0
        }
      }
    }
  }
})

function App() {
  const [owner, setOwner] = useState(() => localStorage.getItem('lastOwner') || '')
  const [repo, setRepo] = useState(() => localStorage.getItem('lastRepo') || '')
  const [releases, setReleases] = useState<any[]>([])

  const fetchReleases = async () => {
    if (!owner || !repo) return
    localStorage.setItem('lastOwner', owner)
    localStorage.setItem('lastRepo', repo)
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)
    const data = await response.json()
    setReleases(data)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchReleases()
  }

  const calculateTotalDownloads = (releases: any[]) => {
    return releases.reduce((total, release) => {
      const releaseDownloads = release.assets.reduce(
        (sum: number, asset: any) => sum + asset.download_count,
        0
      )
      return total + releaseDownloads
    }, 0)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box 
        sx={{ 
          bgcolor: 'background.default',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <GitHub sx={{ fontSize: { xs: 30, sm: 40 } }} />
              <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                GitHub Release Stats
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Repository"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!owner || !repo}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Get Stats
                </Button>
              </Stack>
            </form>

            {releases.length > 0 && (
              <Card sx={{ mb: 3, p: 2, bgcolor: 'primary.dark' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Download />
                  <Typography variant="h6">
                    Total Downloads: {calculateTotalDownloads(releases).toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            )}

            {releases.map((release) => (
              <Card key={release.id} sx={{ mb: 2, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {release.tag_name}
                      {release.name && ` - ${release.name}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Released on {new Date(release.published_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {release.prerelease && (
                    <Chip label="Pre-release" color="warning" size="small" />
                  )}
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {release.body}
                </Typography>

                <Box sx={{ overflow: 'auto', pb: 1 }}>
                  <Stack 
                    direction="row" 
                    spacing={2}
                    sx={{ 
                      minWidth: 'min-content',
                      '& > *': {
                        flex: '0 0 auto',
                        width: {
                          xs: '200px',
                          sm: 'auto'
                        }
                      }
                    }}
                  >
                    {release.assets.map((asset: any) => (
                      <Card
                        key={asset.id}
                        variant="outlined"
                        sx={{ 
                          p: 2,
                          minWidth: {
                            xs: '200px',
                            sm: '200px'
                          }
                        }}
                      >
                        <Typography 
                          variant="subtitle2" 
                          noWrap 
                          title={asset.name}
                          sx={{ mb: 1 }}
                        >
                          {asset.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Download fontSize="small" />
                          <Typography variant="body2" noWrap>
                            {(asset.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            • {asset.download_count} downloads
                          </Typography>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </Card>
            ))}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App 