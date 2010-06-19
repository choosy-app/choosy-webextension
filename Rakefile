require 'crxmake'

task :build do
  CrxMake.zip(
    :ex_dir => '.',
    :pkey => './keys/choosy-chrome.pem',
    :zip_output => './pkg/choosy.zip',
    :verbose => true,
    :ignorefile => /Rakefile/,
    :ignoredir => /(?:keys|pkg|\.git)/
  )
end

task :default => :build
