<?php
/**
 * Plugin Name:     Typography
 * Plugin URI:      https://github.com/madila/typography
 * Description:     A typography plugin for WordPress
 * Author:          Ruben Madila
 * Author URI:      rubenmadila.com
 * Text Domain:     typography
 * Domain Path:     /languages
 * Version:         0.1.1
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
			add_action( 'wp_enqueue_scripts', array($this, 'enqueue_fonts'));
            add_action( 'enqueue_block_editor_assets', array($this, 'enqueue_fonts') );
            add_action( 'enqueue_block_editor_assets', array($this, 'enqueue_block_scripts') );
			$this->init();
		}

        /**
         * Enqueue the block's assets for the editor.
         *
         * wp-blocks:  The registerBlockType() function to register blocks.
         * wp-element: The wp.element.createElement() function to create elements.
         * wp-i18n:    The __() function for internationalization.
         *
         * @since 1.0.0
         */
        public function enqueue_block_scripts() {
            wp_enqueue_script(
                'typography-enqueue_block_scripts', // Unique handle.
                plugins_url( 'assets/scripts.js', __FILE__ ), // block.js: We register the block here.
                array( 'wp-blocks', 'wp-i18n', 'wp-element' ) // Dependencies, defined above.
            );
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
