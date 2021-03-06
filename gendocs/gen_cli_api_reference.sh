#!/usr/bin/env bash

rm -f cli.md
touch cli.md

gen_cmd_docs () {
    CMD=$1

    echo '## `'${CMD}'`' >> cli.md
    echo '```' >> cli.md
    quilt3 ${CMD} -h >> cli.md
    echo '```' >> cli.md
}

echo "# Quilt3 CLI" >> cli.md
echo "" >> cli.md

gen_cmd_docs 'catalog'
quilt3 catalog --detailed_help >> cli.md
gen_cmd_docs 'install'
gen_cmd_docs 'verify'
gen_cmd_docs 'login'
gen_cmd_docs 'logout'
gen_cmd_docs 'config'

mv cli.md "../docs/API Reference/cli.md"




