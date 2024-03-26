
<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  // Defining TreeNode class
  class TreeNode {
    data: any;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(data1: any) {
      this.data = data1;
      this.left = null;
      this.right = null;
    }

    getHeight(): number {
      let leftH = this.left ? this.left.getHeight() : 0;
      let rightH = this.right ? this.right.getHeight() : 0;
      return 1 + Math.max(leftH, rightH);
    }

    setLeftNode(node: TreeNode): void {
      this.left = node;
    }

    setRightNode(node: TreeNode): void {
      this.right = node;
    }

    getNodeData(): any {
      return this.data;
    }

    isLeftPresent(): boolean {
      return this.left !== null;
    }

    isRightPresent(): boolean {
      return this.right !== null;
    }
  }

  // Defining component logic
  let inputValue = "";
  let canvasRef: HTMLCanvasElement | null = null;
  let rootNode: TreeNode | null = null;
  const dispatch = createEventDispatcher();
 const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    inputValue = target.value;
    updateTree(inputValue);
  }
};

  const updateTree = (input: string) => {
    const root = convertArrayToTree(input);
    rootNode = root;
    drawFinalTree(rootNode, canvasRef);
  };

  const convertArrayToTree = (input: string): TreeNode | null => {
    let parsedInput = parseInput(input);
    if (!parsedInput || parsedInput.length === 0) return null;
    const queue: TreeNode[] = [];
    const root = new TreeNode(parsedInput[0]);
    queue.push(root);
    let idx = 1;
    while (idx < parsedInput.length) {
      const currentNode = queue.shift();
      if (idx < parsedInput.length) {
        if (parsedInput[idx] != null) {
          const leftNode = new TreeNode(parsedInput[idx]);
          currentNode?.setLeftNode(leftNode);
          queue.push(leftNode);
        }
        idx++;
      }
      if (idx < parsedInput.length) {
        if (parsedInput[idx] != null) {
          const rightNode = new TreeNode(parsedInput[idx]);
          currentNode?.setRightNode(rightNode);
          queue.push(rightNode);
        }
        idx++;
      }
    }
    return root;
  };

  const parseInput = (input: string): any[] => {
    let str = "";
    for (let i = 0; i < input.length; i++) {
      const ch = input.charAt(i);
      if (ch !== " " && ch !== "[" && ch !== "]") {
        str += ch;
      }
    }
    return str.split(",").map((e) => {
      if (e === "null") return null;
      return parseInt(e);
    });
  };

  const drawFinalTree = (
    rootNode: TreeNode | null,
    canvasEle: HTMLCanvasElement | null
  ) => {
    const ctx = canvasEle?.getContext("2d");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (ctx && rootNode) {
      ctx.clearRect(0, 0, windowWidth, windowHeight);
      const { nodeDivwidth } = getTreeHeightWidth(rootNode);
      const windowCntr = windowWidth / 2;
      const nodeDivwidthcenter = nodeDivwidth / 2;
      const xStart = windowCntr - nodeDivwidthcenter;
      const xEnd = windowCntr + nodeDivwidthcenter;
      const XaxisData = { xStart, xEnd };
      drawTreeRecursively(rootNode, ctx, 0.3, XaxisData);
    }
  };

  const getTreeHeightWidth = (node: TreeNode): { nodeDivwidth: number } => {
    const height = node.getHeight();
    const maxwidth = Math.pow(2, height);
    const nodeDivwidth = maxwidth * 15;//widthspacing
    return { nodeDivwidth };
  };

  const drawTreeRecursively = (
    node: TreeNode,
    ctx: CanvasRenderingContext2D,
    currlevel: number,
    XaxisData: { xStart: number; xEnd: number }
  ) => {
    const { xStart, xEnd } = XaxisData;

    const xPos = (xStart + xEnd) / 2;
    const yPos = currlevel * 32; // Assuming height spacing as 90

    const nodeValue = node.getNodeData()?.toString() || "";
    drawNode(nodeValue, ctx, xPos, yPos);

    if (node.isLeftPresent()) {
      const leftNodeHorizontalConfig = { xStart, xEnd: xPos };
      const leftNode = node.left as TreeNode;
      drawTreeRecursively(
       leftNode,
        ctx,
        currlevel + 1,
        leftNodeHorizontalConfig
      );

      const XCoordinate = { xStart: xPos, xEnd: (xStart + xPos) / 2 };
      const YCoordinate = {
        yStart: yPos + 10,
        yEnd: (currlevel + 1) * 32 - 10,
      };

      drawLinktoNodes(ctx, XCoordinate, YCoordinate);
    }

    if (node.isRightPresent()) {
      const rightNodeHorizontalConfig = { xStart: xPos, xEnd };
       const rightNode = node.right as TreeNode;
      drawTreeRecursively(
        rightNode,
        ctx,
        currlevel + 1,
        rightNodeHorizontalConfig
      );

      const XCoordinate = { xStart: xPos, xEnd: (xPos + xEnd) / 2 };
      const YCoordinate = {
        yStart: yPos + 10,
        yEnd: (currlevel + 1) * 32 - 10,
      };

      drawLinktoNodes(ctx, XCoordinate, YCoordinate);
    }
  };

  const drawNode = (value: string, ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Implement drawNode function logic here
    // This function draws a single node on the canvas
    const randomColor = getRandomColor();
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = randomColor;
    ctx.fill();
    ctx.strokeStyle = randomColor;
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(value, x, y + 10 / 3);
  };

  const drawLinktoNodes = (
    ctx: CanvasRenderingContext2D,
    XCoordinate: { xStart: number; xEnd: number },
    YCoordinate: { yStart: number ; yEnd: number }
  ) => {
    // Implementing drawLinktoNodes function logic here
    // This function draws the links between nodes on the canvas
    const { xStart, xEnd } = XCoordinate;
    const { yStart, yEnd } = YCoordinate;
    const start = { x: xStart, y: yStart };
    const end = { x: xEnd, y: yEnd };

    const xHalf = (xStart + xEnd) / 2;
    const yHalf = (yStart + yEnd) / 2;

    const cp1 = { x: xHalf, y: yHalf };
    const cp2 = { x: xEnd, y: yHalf };

    ctx.beginPath();
    ctx.strokeStyle = "#505251";
    ctx.lineWidth = 2;
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const getRandomColor = () => {
    // Implementing getRandomColor function logic here
    // This function generates a random color for node drawing
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleClearCanvas = () => {
    inputValue = "";
    const ctx = canvasRef?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };
</script>

<style>
   .Tree{
     color:chocolate;
     display: flex;
     justify-content: center;
     align-items: center;
     margin-bottom: 1rem;
   }
   .text{
     font-size: medium;
     margin-bottom: 1rem;
     
   }
   .inp{
    margin-bottom: 1rem;
    border: 0.1rem solid blue;
   }
   .inp1{
    margin-bottom: 1rem;
    font-size: medium;
   }
   .cnvs{
     margin-bottom: 1rem;
   }
</style>

<div>
    <h2 class="Tree">TreeVisualizer</h2>
    <div class="">
      <p class="text">Enter the tree (comma-separated values): </p>
      <input
        class="inp"
        type="text"
        bind:value={inputValue}
         on:input={handleInputChange}
      />
      <button
        class="inp1"
        on:click={handleClearCanvas}
      >
        Clear
      </button>
    </div>
    <div class="">
      <canvas
        bind:this={canvasRef}
        class="cnvs"
      ></canvas>
    </div>
</div>


