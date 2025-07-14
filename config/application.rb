require_relative "boot"

# require "rails/all"
# Require the frameworks you want:
require "active_model/railtie"
# require "active_record/railtie" # We don't need this for a non-database app
# require "active_storage/engine" # We don't need this
require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "active_job/railtie"
require "action_cable/engine"
# require "action_mailbox/engine" # We don't need this
# require "action_text/engine" # We don't need this
require "rails/test_unit/railtie"
require "sprockets/railtie"
require "rails/health/railtie"
require "turbo-rails" # If you are using Turbo
require "stimulus/railtie" # If you are using Stimulus

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module PasswordGeneratorApp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
