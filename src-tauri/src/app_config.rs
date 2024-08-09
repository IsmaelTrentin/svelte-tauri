use serde::{Deserialize, Serialize};
use std::fs::{read_to_string, write};
use std::path::PathBuf;
use tauri::App;

use crate::Error;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppConfig {
    pub version: String,
    pub db_path: String,
}

pub const DEFAULT_CONFIG: &str = "# config
version = \"1\"
db_path = \"<data>/db.sqlite\"
";

pub fn ensure_config_dir(app: &App) -> PathBuf {
    let conf_path = app
        .path_resolver()
        .app_config_dir()
        .expect("failed to resolve config path");
    if !conf_path.exists() {
        std::fs::create_dir_all(&conf_path).expect("failed to create config path");
    }

    conf_path
}

pub fn read_config(path: &PathBuf) -> Result<AppConfig, Error> {
    let conf: AppConfig;
    let conf_file_path_str = path.display().to_string();
    if !path.exists() {
        conf = toml::from_str(DEFAULT_CONFIG)
            .map_err(|_| Error::BadConfig(String::from("bad default config")))?;
        write(path, DEFAULT_CONFIG).map_err(|e| Error::Io(e))?;
        dbg!("config file created");
    } else {
        let config_data = read_to_string(path).expect(&format!(
            "failed to read config file ({})",
            &conf_file_path_str
        ));
        conf = toml::from_str(&config_data).map_err(|e| Error::BadConfig(e.to_string()))?;
        dbg!("read config file ok");
    }

    Ok(conf)
}
