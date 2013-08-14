
# delete existing hardwired formats
Gollum::Markup.formats.delete_if { true }

# add plain text support
Gollum::Markup.register(:txt, "Plain Text") do |content|
  "\n<pre>\n#{content}\n<pre>\n"
end

# make plain text the default
Precious::App.set(:default_markup, :txt)
