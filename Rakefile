require 'crxmake'
require 'json'

task :build do
  manifest_data = JSON.load(File.read('./manifest.json'))
  CrxMake.zip(
    :ex_dir => '.',
    :pkey => './keys/choosy-chrome.pem',
    :zip_output => "./pkg/choosy-#{manifest_data['version']}.zip",
    :verbose => true,
    :ignorefile => /Rakefile/,
    :ignoredir => /(?:keys|pkg|\.git)/
  )
end

task :default => :build
