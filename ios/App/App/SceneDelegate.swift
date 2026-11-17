import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }

        let window = UIWindow(windowScene: windowScene)
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateInitialViewController() ?? CAPBridgeViewController()
        window.rootViewController = viewController
        self.window = window
        window.makeKeyAndVisible()
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Called as the scene is being released by the system.
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Called when the scene has moved from an inactive state to an active state.
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Called when the scene will move from an active state to an inactive state.
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Called as the scene transitions from the background to the foreground.
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Called as the scene transitions from the foreground to the background.
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }
        ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }
}
