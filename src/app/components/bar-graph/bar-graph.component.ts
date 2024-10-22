import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

interface LanguageData {
  language: string;
  value: number;
}

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css']
})
export class BarGraphComponent implements AfterViewInit {
  private data: LanguageData[] = [
    { language: 'JavaScript', value: 70 },
    { language: 'Python', value: 80 },
    { language: 'Java', value: 60 },
    { language: 'C++', value: 50 },
    { language: 'Go', value: 40 },
  ];

  private margin = { top: 60, right: 30, bottom: 50, left: 60 };
  private width = 400 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor() { }

  ngAfterViewInit(): void {
    // Use setTimeout to ensure the SVG is rendered before D3 tries to access it
    setTimeout(() => {
      this.createSvg();
      this.drawBars();
    }, 0);
  }

  private createSvg(): void {
    d3.select('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
  }

  private drawBars(): void {
    const svg = d3.select('svg');

    // Clear previous content
    svg.selectAll('*').remove();

    const xScale = d3.scaleBand<string>()
      .domain(this.data.map(d => d.language))
      .range([0, this.width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value) || 100])
      .range([this.height, 0]);

    // Draw X axis
    svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('fill', '#000')
      .attr('x', this.width / 2)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .text('Programming Languages');

    // Draw Y axis
    svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -this.height / 2)
      .attr('text-anchor', 'middle')
      .text('Usage (%)');

    // Draw bars
    const bars = svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', d => this.margin.left + xScale(d.language)!)
      .attr('y', d => this.margin.top + yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => this.height - yScale(d.value))
      .attr('fill', '#4CAF50');

    // Add hover effect using regular functions
    bars.on('mouseover', function () {
        d3.select(this).attr('fill', '#FF5733'); // Change color on hover
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#4CAF50'); // Revert color when not hovering
      });
  }
}
