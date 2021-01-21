'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
    throw err
})

const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const appendFile = util.promisify(require('fs').appendFile)

async function build() {
    const root = path.resolve(__dirname, '..')
    const sourceDir = path.resolve(root, 'src')
    const targetDir = path.resolve(root, 'lib')
    const jsTarget = targetDir
    const cssTarget = path.resolve(targetDir, 'css')
    const hackFileName = 'antd-globals-hiding-hack'
    const hackFileSource = path.resolve(
        sourceDir,
        'less',
        hackFileName + '.less',
    )
    const hackFileOutputPath = path.resolve(cssTarget, hackFileName + '.css')

    try {
        // clean
        process.stdout.write('Cleaning... \n')
        const cleanResult = await exec('npm run clean')

        // transpiling and copy js
        process.stdout.write('Transpiling js with babel... \n')
        const jsResult = await exec(`babel ${sourceDir} --out-dir ${jsTarget}`)

        // copy css
        process.stdout.write('Copying library style definitions... \n')
        const cssResult = await exec(
            `cpy ${sourceDir}/css/style.css ${cssTarget}`,
        )

        // compile antd-hack less into css and copy it into lib
        process.stdout.write('Implementing antd hack... \n')
        const heckResult = await exec(
            `lessc --js ${hackFileSource} ${hackFileOutputPath}`,
        )
        // append lib/index.js with line importing antd-hack
        const linesToBeAdded = [
            '',
            '',
            '// this line has been added by scripts/build.js',
            "require('./css/antd-globals-hiding-hack.css');",
            '',
        ]

        const stylesFile = [
            `.header1-text{
          font-size: 25px;
          color: #90CDF9;
          font-weight: 500;
      }
      
      .header2-text {
          font-size: 14px;
          font-weight: 500;
      }
      
      .header3-text {
          font-size: 12px;
          font-weight: 500;
      }
      
      .base-text {
          font-size: 12px;
      }
      
      .help-text {
          font-size: 12px;
          color: #999;
      }
      
      .disabled-text {
          font-size: 12px;
          color: #ccc;
      }
      
      .scheduler {
          margin: 20px auto;
          border-spacing: 0;
      }
      
      .scheduler td {
          padding: 0px;
      }
      
      .expander-space {
          overflow: hidden;
          display: inline-block;
          width: 1em;
          height: 1em;
          line-height: 1em;
          font-size: .9em;
          vertical-align: middle;
          margin-top: -1%;
      }
      
      .resource-view {
          border: 1px solid #e9e9e9;
          overflow: hidden;
      }
      
      .scheduler-view {
          border: 1px solid #e9e9e9;
          margin: 0 0 0 -1px;
          padding: 0;
      }
      
      .scheduler-content {
          position: relative;
          z-index: 2;
      }
      
      .scheduler-bg {
          position: absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          z-index: 1;
      }
      
      table.resource-table, table.scheduler-bg-table, table.scheduler-table {
          width: 100%;
          margin: 0;
          padding: 0;
          border-spacing: 0;
          text-align: center;
      }
      
      table.scheduler-table {
          border: 1px solid #e9e9e9;
      }
      
      table.scheduler-content-table {
          margin: 0;
          padding: 0;
          border: 0 solid #e9e9e9;
          border-spacing: 0;
      }
      
      table.resource-table tr, table.scheduler-bg-table tr, table.scheduler-table tr {border-bottom: 1px solid #e9e9e9}
      
      table.resource-table th, table.scheduler-table th, table.resource-table td, table.scheduler-bg-table td, table.scheduler-table td{
          border-right: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
      }
      
      table.scheduler-bg-table th {
          border-right: 1px solid #e9e9e9;
      }
      
      table.resource-table tr th:last-child, /*table.scheduler-bg-table tr th:last-child, */table.scheduler-table tr th:last-child,
      table.resource-table tr td:last-child, /*table.scheduler-bg-table tr td:last-child, */table.scheduler-table tr td:last-child{ border-right: 0 }
      /*table.resource-table tr:last-child td, table.scheduler-bg-table tr:last-child td, */table.scheduler-table tr:last-child td{ border-bottom: 0 }
      
      .timeline-event {
          position: absolute;
      }
      
      .day-event {
          position: relative;
          display: inline-block;
          margin: 0px 5px;
      }
      
      .day-event-container {
          text-align: left;
          padding: 5px 5px 0 5px;
      }
      
      .round-all {
          border-radius: 14px;
      }
      
      .round-head {
          border-radius: 14px 0px 0px 14px;
      }
      
      .round-tail {
          border-radius: 0px 14px 14px 0px;
      }
      
      .round-none {
          border-radius: 0px;
      }
      
      .event-container {
          position: relative;
      }
      
      .event-item {
          margin: 1px 0;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
          padding-right: 20px !important;
      }
      
      .overflow-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-right: 5px !important;
      }
      
      .status-dot {
          width: 14px;
          height: 14px;
          border-radius: 7px;
      }
      
      .ant-radio-button-wrapper-checked {
          background-color: #108EE9;
          color: #FFFFFF;
      }
      
      .icon-nav:hover{
          color:#1E90FF !important;
          box-shadow: 0 0 0px !important;
          cursor: pointer;
      }
      
      .add-more-popover-overlay {
          position: absolute;
          z-index: 5;
          border: 1px solid #e5e5e5;
          background-color: #fff;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
          padding: 10px;
      }
      
      .popover-calendar {
          width: 300px;
      }
      
      .popover-calendar .ant-calendar {
          box-shadow: 0 1px 6px rgba(0,0,0,0) !important;
      }
      
      .event-resizer {
          position: absolute;
          z-index: 4;
          display: block;
          width:7px;
          top: -1px;
          bottom: -1px;
      }
      
      .event-start-resizer {
          cursor: w-resize;
          left: -1px;
      }
      
      .event-end-resizer {
          cursor: e-resize;
          right: -1px;
      }
      
      .selected-area {
          position: absolute;
      }
      
      .slot-cell {
          padding-left: 4px;
          padding-right: 4px;
      }
      
      .slot-text {
          display: inline-block;
          padding-left: 4px;
          padding-right: 4px;
      }
      
      `,
        ]

        await appendFile(`${targetDir}/index.js`, linesToBeAdded.join('\n'))
        await appendFile(`${targetDir}/css/style.css`, stylesFile.join('\n'))

        process.stdout.write('Success! \n')
    } catch (e) {
        process.stderr.write(e)
        process.exit()
    }
}

build()
