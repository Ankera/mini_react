function loader(css){
  console.log('css', css)
  const style = `

    var style = document.createElement('style');

    style.innerHTML = ${JSON.stringify(css)};

    document.head.appendChild(style)
  `;

  return style;
}

module.exports = loader;