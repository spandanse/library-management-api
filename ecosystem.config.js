module.exports = {
  apps: [
    {
      name: "library-api",
      script: "./server.js",

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      restart_delay: 3000,
      max_memory_restart: "300M",

      kill_timeout: 5000,

      wait_ready: true,
      listen_timeout: 5000
    }
  ]
};