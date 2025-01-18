import { useState } from 'react'
import { Container, Paper, TextField, Button, Typography, Box, Card, Chip, Stack } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Download, GitHub } from '@mui/icons-material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3'
    }
  }
})

function App() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [releases, setReleases] = useState<any[]>([])

  const fetchReleases = async () => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)
    const data = await response.json()
    setReleases(data)
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <GitHub sx={{ fontSize: 40 }} />
            <Typography variant="h4" component="h1">
              GitHub Release Stats
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Repository"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              size="large"
              onClick={fetchReleases}
              disabled={!owner || !repo}
            >
              Get Stats
            </Button>
          </Stack>

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

              <Stack direction="row" spacing={2}>
                {release.assets.map((asset: any) => (
                  <Card
                    key={asset.id}
                    variant="outlined"
                    sx={{ p: 2, minWidth: 200 }}
                  >
                    <Typography variant="subtitle2">{asset.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Download fontSize="small" />
                      <Typography variant="body2">
                        {(asset.size / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • {asset.download_count} downloads
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Card>
          ))}
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default App 