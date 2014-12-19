class NotesController < ApplicationController

  def index
    @note = Note.new
    @notes = Note.all
    @user = User.find_by_id(session[:user_id])
  end

  def create
    @user = User.find_by_id(session[:user_id])
    @user.notes.create(latitude: cookies[:latitude], longitude: cookies[:longitude], note_message: note_params[:note_message])
    redirect_to notes_path
  end

  private

  def note_params
    params.require(:note).permit(:note_message)
  end

end
