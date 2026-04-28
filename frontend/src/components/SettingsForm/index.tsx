import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type UseAppStoreType, AppContext } from '../../contexts/AppContext';
import {
  Grid,
  Paper,
  Switch,
  useTheme,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  Slider,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
} from '@mui/material';
import SelectLanguage from './SelectLanguage';
import {
  Translate,
  Palette,
  LightMode,
  DarkMode,
  SettingsOverscan,
  Link,
  QrCode,
  SettingsInputAntenna,
  NotificationsActive,
} from '@mui/icons-material';
import { systemClient } from '../../services/System';
import Tor from '../Icons/Tor';
import { UseFederationStoreType, FederationContext } from '../../contexts/FederationContext';

interface SettingsFormProps {
  dense?: boolean;
}

const SettingsForm = ({ dense = false }: SettingsFormProps): React.JSX.Element => {
  const { updateConnection } = useContext<UseFederationStoreType>(FederationContext);
  const { settings, setSettings, client } = useContext<UseAppStoreType>(AppContext);
  const theme = useTheme();
  const { t } = useTranslation();
  const [tab, setTab] = useState<'general' | 'notifications'>('general');
  const fontSizes = [
    { label: 'XS', value: { basic: 12, pro: 10 } },
    { label: 'S', value: { basic: 13, pro: 11 } },
    { label: 'M', value: { basic: 14, pro: 12 } },
    { label: 'L', value: { basic: 15, pro: 13 } },
    { label: 'XL', value: { basic: 16, pro: 14 } },
  ];

  const browserNotificationSupport = useMemo(() => {
    return typeof Notification !== 'undefined';
  }, []);

  const persistSettings = (nextSettings: typeof settings): void => {
    setSettings(nextSettings);
    systemClient.setItem(
      'settings_offer_notifications_enabled',
      String(nextSettings.offerNotificationsEnabled),
    );
    systemClient.setItem(
      'settings_offer_notification_provider',
      nextSettings.offerNotificationProvider,
    );
    systemClient.setItem('settings_pushover_app_token', nextSettings.pushoverAppToken);
    systemClient.setItem('settings_pushover_user_key', nextSettings.pushoverUserKey);
    systemClient.setItem('settings_pushover_device', nextSettings.pushoverDevice);
  };

  const requestBrowserNotifications = (): void => {
    if (typeof Notification === 'undefined') {
      return;
    }

    void Notification.requestPermission().then(() => {
      setSettings({ ...settings });
    });
  };

  return (
    <Grid item xs={12}>
      <Grid container direction='column' justifyItems='center' alignItems='center'>
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}>
            <Tabs value={tab} onChange={(_event, value) => setTab(value)} variant='fullWidth'>
              <Tab label={t('General')} value='general' />
              <Tab label={t('Notifications')} value='notifications' />
            </Tabs>
          </Box>

          <div style={{ display: tab === 'general' ? '' : 'none' }}>
            <List dense={dense}>
              <ListItem>
                <ListItemIcon>
                  <Translate />
                </ListItemIcon>
                <SelectLanguage
                  language={settings.language}
                  setLanguage={(language) => {
                    setSettings({ ...settings, language });
                    systemClient.setItem('settings_language', language);
                  }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Palette />
                </ListItemIcon>
                <FormControlLabel
                  labelPlacement='end'
                  label={settings.mode === 'dark' ? t('Dark') : t('Light')}
                  control={
                    <Switch
                      checked={settings.mode === 'dark'}
                      checkedIcon={
                        <Paper
                          elevation={3}
                          sx={{
                            width: '1.2em',
                            height: '1.2em',
                            borderRadius: '0.4em',
                            backgroundColor: 'white',
                            position: 'relative',
                            top: `${7 - 0.5 * theme.typography.fontSize}px`,
                          }}
                        >
                          <DarkMode sx={{ width: '0.8em', height: '0.8em', color: '#666' }} />
                        </Paper>
                      }
                      icon={
                        <Paper
                          elevation={3}
                          sx={{
                            width: '1.2em',
                            height: '1.2em',
                            borderRadius: '0.4em',
                            backgroundColor: 'white',
                            padding: '0.07em',
                            position: 'relative',
                            top: `${7 - 0.5 * theme.typography.fontSize}px`,
                          }}
                        >
                          <LightMode sx={{ width: '0.67em', height: '0.67em', color: '#666' }} />
                        </Paper>
                      }
                      onChange={(e) => {
                        const mode = e.target.checked ? 'dark' : 'light';
                        setSettings({ ...settings, mode });
                        systemClient.setItem('settings_mode', mode);
                      }}
                    />
                  }
                />
                {settings.mode === 'dark' ? (
                  <>
                    <ListItemIcon>
                      <QrCode />
                    </ListItemIcon>
                    <FormControlLabel
                      sx={{ position: 'relative', right: '1.5em', width: '3em' }}
                      labelPlacement='end'
                      label={settings.lightQRs ? t('Light') : t('Dark')}
                      control={
                        <Switch
                          checked={!settings.lightQRs}
                          checkedIcon={
                            <Paper
                              elevation={3}
                              sx={{
                                width: '1.2em',
                                height: '1.2em',
                                borderRadius: '0.4em',
                                backgroundColor: 'white',
                                position: 'relative',
                                top: `${7 - 0.5 * theme.typography.fontSize}px`,
                              }}
                            >
                              <DarkMode sx={{ width: '0.8em', height: '0.8em', color: '#666' }} />
                            </Paper>
                          }
                          icon={
                            <Paper
                              elevation={3}
                              sx={{
                                width: '1.2em',
                                height: '1.2em',
                                borderRadius: '0.4em',
                                backgroundColor: 'white',
                                padding: '0.07em',
                                position: 'relative',
                                top: `${7 - 0.5 * theme.typography.fontSize}px`,
                              }}
                            >
                              <LightMode
                                sx={{ width: '0.67em', height: '0.67em', color: '#666' }}
                              />
                            </Paper>
                          }
                          onChange={(e) => {
                            const lightQRs = !e.target.checked;
                            setSettings({ ...settings, lightQRs });
                            systemClient.setItem('settings_light_qr', String(lightQRs));
                          }}
                        />
                      }
                    />
                  </>
                ) : (
                  <></>
                )}
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <SettingsOverscan />
                </ListItemIcon>
                <Slider
                  value={settings.fontSize}
                  min={settings.frontend === 'basic' ? 12 : 10}
                  max={settings.frontend === 'basic' ? 16 : 14}
                  step={1}
                  onChange={(e) => {
                    const fontSize = e.target.value;
                    setSettings({ ...settings, fontSize });
                    systemClient.setItem(
                      `settings_fontsize_${settings.frontend}`,
                      fontSize.toString(),
                    );
                  }}
                  valueLabelDisplay='off'
                  marks={fontSizes.map(({ label, value }) => ({
                    label: <Typography variant='caption'>{t(label)}</Typography>,
                    value: settings.frontend === 'basic' ? value.basic : value.pro,
                  }))}
                  track={false}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <SettingsInputAntenna />
                </ListItemIcon>
                <ToggleButtonGroup
                  sx={{ width: '100%' }}
                  exclusive={true}
                  value={settings.connection}
                  onChange={(_e, connection) => {
                    setSettings({ ...settings, connection });
                    systemClient.setItem('settings_connection', connection);
                  }}
                >
                  <ToggleButton value='api' color='primary' sx={{ flexGrow: 1 }}>
                    {t('API')}
                  </ToggleButton>
                  <ToggleButton value='nostr' color='secondary' sx={{ flexGrow: 1 }}>
                    {t('nostr')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Link />
                </ListItemIcon>
                <ToggleButtonGroup
                  sx={{ width: '100%' }}
                  exclusive={true}
                  value={settings.network}
                  onChange={(_e, network) => {
                    const newSetting = { ...settings, network };
                    updateConnection(newSetting);
                    setSettings({ ...settings, network });
                    systemClient.setItem('settings_network', network);
                  }}
                >
                  <ToggleButton value='mainnet' color='primary' sx={{ flexGrow: 1 }}>
                    {t('Mainnet')}
                  </ToggleButton>
                  <ToggleButton value='testnet' color='secondary' sx={{ flexGrow: 1 }}>
                    {t('Testnet')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </ListItem>

              {client == 'mobile' && (
                <ListItem>
                  <ListItemIcon>
                    <Tor />
                  </ListItemIcon>
                  <ToggleButtonGroup
                    exclusive={true}
                    sx={{ width: '100%' }}
                    value={settings.useProxy}
                    onChange={(_e, useProxy) => {
                      setSettings({ ...settings, useProxy });
                      systemClient.setItem('settings_use_proxy', String(useProxy));
                      systemClient.restart();
                    }}
                  >
                    <ToggleButton value={false} color='primary' sx={{ flexGrow: 1 }}>
                      {t('Orbot')}
                    </ToggleButton>
                    <ToggleButton value={true} color='secondary' sx={{ flexGrow: 1 }}>
                      {t('Build-in')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ListItem>
              )}
            </List>
          </div>

          <div style={{ display: tab === 'notifications' ? '' : 'none' }}>
            <List dense={dense}>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon>
                  <NotificationsActive />
                </ListItemIcon>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label={t('Enable offer alerts')}
                      control={
                        <Switch
                          checked={settings.offerNotificationsEnabled}
                          onChange={(e) => {
                            persistSettings({
                              ...settings,
                              offerNotificationsEnabled: e.target.checked,
                            });
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ToggleButtonGroup
                      exclusive={true}
                      sx={{ width: '100%' }}
                      value={settings.offerNotificationProvider}
                      onChange={(_e, offerNotificationProvider) => {
                        if (!offerNotificationProvider) return;
                        persistSettings({ ...settings, offerNotificationProvider });
                      }}
                    >
                      <ToggleButton value='browser' color='primary' sx={{ flexGrow: 1 }}>
                        {t('Browser')}
                      </ToggleButton>
                      <ToggleButton value='pushover' color='secondary' sx={{ flexGrow: 1 }}>
                        {t('Pushover')}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </ListItem>

              {settings.offerNotificationProvider === 'browser' && (
                <ListItem>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant='body2' color='text.secondary'>
                        {browserNotificationSupport
                          ? t(
                              'Use browser notifications while the RoboSats app is open in this browser.',
                            )
                          : t('This browser does not support browser notifications.')}
                      </Typography>
                    </Grid>
                    {browserNotificationSupport && (
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={requestBrowserNotifications}>
                          {typeof Notification !== 'undefined' &&
                          Notification.permission === 'granted'
                            ? t('Browser Notifications Enabled')
                            : t('Enable Browser Notifications')}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </ListItem>
              )}

              {settings.offerNotificationProvider === 'pushover' && (
                <ListItem>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant='body2' color='text.secondary'>
                        {t(
                          'Send matching offer alerts through Pushover using your application token and user key.',
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label={t('Pushover App Token')}
                        value={settings.pushoverAppToken}
                        onChange={(e) => {
                          persistSettings({ ...settings, pushoverAppToken: e.target.value });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label={t('Pushover User Key')}
                        value={settings.pushoverUserKey}
                        onChange={(e) => {
                          persistSettings({ ...settings, pushoverUserKey: e.target.value });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size='small'
                        label={t('Pushover Device (optional)')}
                        value={settings.pushoverDevice}
                        onChange={(e) => {
                          persistSettings({ ...settings, pushoverDevice: e.target.value });
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              )}

              {client == 'mobile' && (
                <ListItem>
                  <ListItemIcon>
                    <NotificationsActive />
                  </ListItemIcon>
                  <ToggleButtonGroup
                    exclusive={true}
                    sx={{ width: '100%' }}
                    value={settings.androidNotifications}
                    onChange={(_e, androidNotifications) => {
                      setSettings({ ...settings, androidNotifications });
                      systemClient.setItem('settings_notifications', String(androidNotifications));
                    }}
                  >
                    <ToggleButton value={true} color='primary' sx={{ flexGrow: 1 }}>
                      {t('Android On')}
                    </ToggleButton>
                    <ToggleButton value={false} color='secondary' sx={{ flexGrow: 1 }}>
                      {t('Android Off')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ListItem>
              )}
            </List>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SettingsForm;
