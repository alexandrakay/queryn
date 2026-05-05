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
]

export default function TopicSelector() {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" color="primary" gutterBottom sx={{ mb: 1 }}>
        queryn
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose a topic to get started.
      </Typography>
      <Grid container spacing={2}>
        {TOPICS.map(({ label, icon: Icon }) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <Card
              sx={{ height: '100%' }}
              onClick={() => navigate(`/quiz/${encodeURIComponent(label)}`)}
            >
              <CardActionArea sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 1.5 }} />
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
