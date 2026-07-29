export default function C4DiagramSummary({ id, diagram }) {
  const { accessibility } = diagram;

  return (
    <section id={id} className='sr-only'>
      <h4>{diagram.level} architecture summary</h4>
      {accessibility.currentService && <p>{accessibility.currentService}</p>}
      <h5>Elements</h5>
      <ul>
        {accessibility.elements.map((element) => <li key={element}>{element}</li>)}
      </ul>
      <h5>Relationships</h5>
      <ul>
        {accessibility.relationships.map((relationship) => <li key={relationship}>{relationship}</li>)}
      </ul>
    </section>
  );
}
