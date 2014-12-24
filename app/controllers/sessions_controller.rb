class SessionsController < ApplicationController

  def create
    @user = User.find_by_email( params[:session][:email] )
    if @user && @user.authenticate( params[:session][:password] )
      session[:user_id] = @user.id
      redirect_to notes_path
    else
      redirect_to root_path
    end
  end

end
