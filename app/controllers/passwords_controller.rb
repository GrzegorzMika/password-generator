DEFAULT_PASSWORD_LENGTH = 100

class PasswordsController < ApplicationController
  def index
  end

  def generate
    length = params[:length].to_i
    length = DEFAULT_PASSWORD_LENGTH if length <= 0
    @password = SecureRandom.hex(length / 2) # Generate a random hex string of the specified length
    respond_to do |format|
      format.json { render json: { password: @password, password_base64: Base64.encode64(@password) } }
      format.html # This will render the index view by default
    end
  rescue StandardError => e
    respond_to do |format|
      format.json { render json: { error: e.message }, status: :unprocessable_entity }
      format.html { render :index, alert: e.message }
    end
  end
end
