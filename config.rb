
# delete existing hardwired formats
Gollum::Markup.formats.delete_if { true }

# add plain text support
Gollum::Markup.register(:txt, "Plain Text") do |content|
  "\n<pre>\n#{content}\n<pre>\n"
end

Precious::App.set(:default_markup, :txt)
#Precious::App.set(:wiki_options, {:universal_toc => false})
