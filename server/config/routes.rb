Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api do
    resources :rooms
    resources :chats

    delete '/admin', to: 'admin#destroy'
  end
  mount ActionCable.server => '/cable'
end
