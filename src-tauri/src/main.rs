#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
    fn write_file(path: &str, data:&str) {
    println! ("writing file {}", path);
    std::fs::write(path, data).expect("error while writing file") ;
    }

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![write_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  
    
}

