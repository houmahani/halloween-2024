const Info = () => {
  return (
    <footer>
      <div className="wrapper-footer">
        <div className="container">
          <div className="about">
            Experience made for Three.js Journey Halloween 2024 challenge
            {/* <ul>
              <li>
                <a href="https://houmahanikane.com/" target="_blank">
                  Houmahani Kane
                </a>
              </li>
              <li>
                {' '}
                <a href="https://x.com/houm_kn" target="_blank">
                  @houm_kn
                </a>
              </li>
              <li>
                <a href="mailto:houmahanikane@gmail.com">Email</a>
              </li>
            </ul> */}
          </div>

          <div className="ressources">
            <div>
              Learning
              <ul>
                <li>
                  <a href="https://threejs-journey.com/" target="_blank">
                    <span>Threejs Journey</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://r3f.docs.pmnd.rs/getting-started/introduction"
                    target="_blank"
                  >
                    <span>React Three Fiber</span>
                  </a>
                </li>
                <li>
                  <a href="https://thebookofshaders.com/" target="_blank">
                    <span>Book Of Shaders</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              Ressources
              <ul>
                <li>
                  Halloween Models{' '}
                  <a href="https://polygonrunway.com/" target="_blank">
                    <span>Polygon Runaway</span>
                  </a>
                </li>
                <li>
                  Sound Effects{' '}
                  <a href="https://pixabay.com/sound-effects/" target="_blank">
                    <span>Pixabay</span>
                  </a>
                </li>
                <li>
                  Shaders Textures{' '}
                  <a
                    href="https://kenney.nl/assets/particle-pack"
                    target="_blank"
                  >
                    <span>Kenney</span>
                  </a>{' '}
                  &{' '}
                  <a
                    href="https://www.freepik.com/free-photos-vectors/pumpkin"
                    target="_blank"
                  >
                    <span>Freepik</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Info
