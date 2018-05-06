package entry;

import java.io.FileInputStream;
import java.security.KeyStore;

import javax.net.ssl.KeyManagerFactory;

import com.cnautosoft.h2o.standalone.StandaloneServer;

public class RegionSoftServer {
	public static void main(String[] args) throws Exception{
		StandaloneServer ss = new StandaloneServer(8088,"/NityFactoryLocalService");
		ss.runHttp();
		
		
		/**
		 * 修改HttpServer.ACCESS_CONTROL_ALLOW_ORIGIN，修改config.js 的frontendPath
		 */
		//ss.runHttps(initSSLEngineKeyManager());
	}
	
	public synchronized static KeyManagerFactory initSSLEngineKeyManager() throws Exception{
		KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
		KeyStore ks = KeyStore.getInstance("JKS");
		String keyStorePath = "E:/RegionSoft_deploy/regionsoft.keystore";
		String keyStorePassword = "As1^235sjdP@!";
		ks.load(new FileInputStream(keyStorePath), keyStorePassword.toCharArray());
		String keyPassword = "As1^235sjdP@!";
		kmf.init(ks, keyPassword.toCharArray());
		return kmf;
	}
}
