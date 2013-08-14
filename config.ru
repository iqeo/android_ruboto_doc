#!/usr/bin/env ruby
require 'rubygems'
require 'gollum/app'

gollum_path = File.expand_path(File.dirname(__FILE__))
Precious::App.set(:gollum_path, gollum_path)
Precious::App.set(:wiki_options, {})                   # required to prevent undefined method error 'wiki_options' in Precious::App

require './gollum_config.rb'

run Precious::App
