use std::{fs, sync::Mutex};

use tauri::State;

use crate::{AppConfig, AppState, Error};

#[tauri::command]
pub async fn get_config(state_mutex: State<'_, Mutex<AppState>>) -> Result<AppConfig, Error> {
    let state = state_mutex.lock()?;

    Ok(state.conf.clone())
}

#[tauri::command]
pub async fn reload_config(
    app: tauri::AppHandle,
    state_mutex: State<'_, Mutex<AppState>>,
) -> Result<AppConfig, Error> {
    let conf_path = app
        .path_resolver()
        .app_config_dir()
        .expect("failed to resolve config path")
        .join("config.toml");
    let config_data = fs::read_to_string(conf_path)?;
    let reloaded_config =
        toml::from_str(&config_data).map_err(|e| Error::BadConfig(e.to_string()))?;

    let mut state = state_mutex.lock()?;
    state.conf = reloaded_config;

    Ok(state.conf.clone())
}
