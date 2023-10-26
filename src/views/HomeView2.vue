<template>
  <div>
    <input type="file" id="fileInput" />
  </div>
</template>

<script>
import Excel from 'exceljs';
import { read } from 'xlsx';
const XLSX = require('xlsx');
export default {
  data() {
    return {
      workbook: null,
    };
  },
  methods: {
    /**
     * buffer转image
     * @param buffer
     */
    bufferToImage(buffer) {
      return new Promise((resolve, reject) => {
        const blob = new Blob([buffer], { type: 'image/png' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    },
    async init(e, workbook) {
      // const workbook2 = XLSX.read(e.target.result, { type: 'binary' });
      // console.log('workbook2', workbook2);

      var data = new Uint8Array(e.target.result);

      workbook = new Excel.Workbook();
      await workbook.xlsx.load(data);

      console.log('workbook', workbook);
      const mediaList = workbook.media;

      const worksheet = workbook._worksheets.find((e) => {
        return e && e._name === 'Sheet1';
      });
      console.log('工作薄', worksheet);

      /**
       *
       * @param cell
       * @returns {'text'|'image'}
       */
      function isType(cell) {}

      const list = [];
      for (let i = 0; i < worksheet._rows.length; i++) {
        const row = worksheet._rows[i];
        const rowList = [];
        for (let j = 0; j < row._cells.length; j++) {
          const cell = row._cells[j];
          rowList.push({
            rowIndex: i,
            colIndex: j,
            cell: cell,
            row: row,
            isMerge: false,
            type: isType(cell),
          });
        }
        list.push(rowList);
      }
      console.log('list', list);

      // list.for

      // list.for

      // list.for

      // console.log('获取浮动图', worksheet.getImages());
      // console.log('ids', worksheet.getBackgroundImageId());

      // 背景图
      // worksheet._rows.forEach((row) => {
      //   row._cells.forEach((cell) => {
      //     const dispimgStr = cell._value.model.result;
      //     if (dispimgStr) {
      //       if (dispimgStr.startsWith('=DISPIMG(')) {
      //         const id = dispimgStr.match(/"([^"]+)"/)[1];
      //         console.log('id', id);
      //       }
      //     }
      //   });
      // });

      // 获取浮动图片
      // worksheet._media.forEach((image) => {
      //   const result = workbook.getImage(image.imageId);
      //   this.bufferToImage(result.buffer).then((res) => {
      //     const { tl, br } = image.range;
      //     const startCell = worksheet.getCell(tl.nativeRow, tl.nativeCol);
      //     const endCell = worksheet.getCell(br.nativeRow, br.nativeCol);
      //     console.log('start');
      //     console.log('图片源 - info', image);
      //     // console.log('图片源 - buffer', result);
      //     console.log('列', image.range.br.nativeCol + 1);
      //     console.log('行', image.range.br.nativeRow + 1);
      //     // console.log(`图片位于单元格 ${startCell.address}:${endCell.address}`);
      //     // console.log('base64', res);
      //     console.log('end');
      //   });
      // });
    },
  },
  async mounted() {
    const that = this;
    var fileInput = document.getElementById('fileInput');
    var workbook;
    fileInput.addEventListener('change', (e) => {
      var file = e.target.files[0];
      var reader = new FileReader();

      reader.onload = async (e) => {
        this.init(e, workbook);
        // this.init2(e, workbook);
      };

      reader.readAsArrayBuffer(file);
    });
  },
};
</script>
