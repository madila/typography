<?php
/**
 * Plugin Name:     Typography
 * Plugin URI:      typography.rubenmadila.com
 * Description:     A typography plugin for WordPress
 * Author:          Ruben Madila
 * Author URI:      rubenmadila.com
 * Text Domain:     typography
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Typography
 */

// Your code starts here.
if ( !class_exists( 'Typography' ) ) {
	class Typography
	{
		private $settings = array(
			'general_typography' => [
				'enabled_providers' => ['Google'],
				'stylesheets' => [
					'typography-fonts' => 'https://use.typekit.net/erw5jkt.css'
				]
			]
		);

		public function __construct() {
			$this->register_options();
			add_action('wp_enqueue_scripts', array($this, 'enqueue_fonts'));
			$this->init();
		}

		public function register_options() {
			foreach($this->settings as $setting_group => $settings) {
				foreach($settings as $setting_key => $setting_default)
				register_setting( $setting_group, $setting_key, array(
					'default' => $setting_default
				) );
				$this->rehydrate_setting( $setting_group , $setting_key);
			}
		}

		public function enqueue_fonts() {
			foreach($this->get_setting('stylesheets') as $stylesheets_key => $stylesheet_url) {
				wp_enqueue_style( $stylesheets_key, $stylesheet_url );
			}
		}

		public function rehydrate_setting($group, $key) {
			$this->settings[$group][$key] = get_option($key);
		}

		public function init() {
		}

		public function get_setting($setting_name) {
			return $this->settings['general_typography'][$setting_name];
		}
	}
	new Typography();
}
