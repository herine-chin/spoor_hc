class NotesController < ApplicationController

  def index
    @note = Note.new
    @noteMarkers = Note.all
    @user = current_user

    if params[:latitude]
      @notes = Note.near( [params[:latitude], params[:longitude] ], 0.00932057 )
    end

    respond_to do |format|
      format.html
      format.json  { render :json => { :noteMarkers => @noteMarkers,
       :localNotes => @notes, :user => @user } }
    end
  end

  def create
    @user = current_user
    @user.notes.create( latitude: cookies[:latitude], longitude: cookies[:longitude], note_message: note_params[:note_message] )
    redirect_to notes_path
  end

  private

  def note_params
    params.require( :note ).permit( :note_message )
  end

end
