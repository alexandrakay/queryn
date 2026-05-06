import { AppBar, Toolbar, Button, Box, IconButton, Tooltip } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import HistoryIcon from '@mui/icons-material/History'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Nav({ mode, onToggle }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { signOut } = useAuth()

  if (pathname.startsWith('/quiz')) return null

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button color="primary" onClick={() => navigate('/')} sx={{ fontFamily: '"Fugaz One", sans-serif', fontSize: '1.1rem' }}>
          queryn
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="History">
            <IconButton color="primary" onClick={() => navigate('/history')}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton onClick={onToggle} color="primary" aria-label={mode === 'light' ? 'Dark mode' : 'Light mode'}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton color="primary" onClick={signOut} aria-label="Sign out">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
