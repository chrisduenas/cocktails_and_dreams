class UsersController < ApplicationController

  def show
    @user = User.find(params[:id])
  end

  def edit

  end

def user_params
params.require(:user).permit(:picture)

end



end
