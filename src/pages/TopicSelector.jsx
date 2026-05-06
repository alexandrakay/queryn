import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'
import DataObjectIcon from '@mui/icons-material/DataObject'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import MemoryIcon from '@mui/icons-material/Memory'
import StorageIcon from '@mui/icons-material/Storage'
import LanIcon from '@mui/icons-material/Lan'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import FunctionsIcon from '@mui/icons-material/Functions'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import CalculateIcon from '@mui/icons-material/Calculate'
import CodeIcon from '@mui/icons-material/Code'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useNavigate } from 'react-router-dom'

const TOPICS = [
  { label: 'Data Structures', icon: DataObjectIcon },
  { label: 'Algorithms', icon: AccountTreeIcon },
  { label: 'Operating Systems', icon: MemoryIcon },
  { label: 'Databases', icon: StorageIcon },
  { label: 'Networks', icon: LanIcon },
  { label: 'Software Design', icon: ArchitectureIcon },
  { label: 'Limits', icon: ShowChartIcon },
  { label: 'Derivatives', icon: FunctionsIcon },
  { label: 'Integrals', icon: IntegrationInstructionsIcon },
  { label: 'Differential Equations', icon: CalculateIcon },
  { label: 'Java Development', icon: CodeIcon },
  { label: 'AI / Machine Learning', icon: SmartToyIcon },
]

export default function TopicSelector() {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: { xs: 3, sm: 4 }, maxWidth: 960, mx: 'auto' }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" color="primary" sx={{ mb: 0.5 }}>
          Pick a topic
        </Typography>
        <Typography variant="body1" color="text.secondary">
          5 AI-generated questions, instant feedback, personalized summary.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {TOPICS.map(({ label, icon: Icon }) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  boxShadow: theme => `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(41,41,102,0.16)' : 'rgba(0,0,0,0.6)'}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'box-shadow 0.2s ease, transform 0.15s ease',
              }}
              onClick={() => navigate(`/quiz/${encodeURIComponent(label)}`)}
            >
              <CardActionArea sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 4.5, px: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      opacity: 0.9,
                    }}
                  >
                    <Icon sx={{ fontSize: 28, color: 'primary.contrastText' }} />
                  </Box>
                  <Typography variant="h6" fontFamily='"Fugaz One", sans-serif'>
                    {label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
