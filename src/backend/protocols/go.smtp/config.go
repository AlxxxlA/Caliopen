// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen_smtp

import (
	broker "github.com/CaliOpen/CaliOpen/src/backend/brokers/go.emails"
)

type (
	SMTPConfig struct {
		AppConfig AppConfig
		LDAConfig broker.LDAConfig
	}

	// AppConfig is a clone of guerrilla AppConfig with relevant tagstrings
	AppConfig struct {
		AppVersion      string         `mapstructure:"version"`
		Servers         []ServerConfig `mapstructure:"inbound_servers"`
		AllowedHosts    []string       `mapstructure:"allowed_hosts"`
		PrimaryMailHost string         `mapstructure:"primary_mail_host"`
		SubmitAddress   string         `mapstructure:"submit_address"`
		SubmitPort      int            `mapstructure:"submit_port"`
		SubmitUser      string         `mapstructure:"submit_user"`
		SubmitPassword  string         `mapstructure:"submit_password"`
		OutWorkers      int            `mapstructure:"submit_workers"`
	}

	// ServerConfig specifies config options for a single smtp server
	ServerConfig struct {
		IsEnabled       bool   `mapstructure:"is_enabled"`
		Hostname        string `mapstructure:"host_name"`
		AllowedHosts    []string
		MaxSize         int64  `mapstructure:"max_size"`
		PrivateKeyFile  string `mapstructure:"private_key_file"`
		PublicKeyFile   string `mapstructure:"public_key_file"`
		Timeout         int    `mapstructure:"timeout"`
		ListenInterface string `mapstructure:"listen_interface"`
		StartTLSOn      bool   `mapstructure:"start_tls_on,omitempty"`
		TLSAlwaysOn     bool   `mapstructure:"tls_always_on,omitempty"`
		MaxClients      int    `mapstructure:"max_clients"`
	}
)
