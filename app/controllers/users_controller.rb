class UsersController < ApplicationController

  def create
    @user = User.create( user_params )
    session[:user_id] = @user.id
    redirect_to notes_path
  end

  private

  def user_params
    params.require( :user ).permit( :first_name, :last_name, :email, :password )
  end

end
