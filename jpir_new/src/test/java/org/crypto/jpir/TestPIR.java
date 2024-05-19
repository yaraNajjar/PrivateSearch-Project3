package org.crypto.jpir;

/*
*    jpir is fork of pir-0.1
*
*    pir-0.1 is Private Information Retrieval Library in Java
*
*    This was originally developed at Stanford
*
*    By People
*    Dan Boneh, Andrew Bortz, Srinivas Inguva, Felipe Saint-Jean, Joan Feigenbaum
*
*    Original Link
*    https://crypto.stanford.edu/pir-library/
*
*    Refactored by Sashank Dara
*
*    This library is free software; you can redistribute it and/or
*    modify it under the terms of the GNU Lesser General Public
*    License as published by the Free Software Foundation; either
*    version 2 of the License, or (at your option) any later version.
*
*    This library is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
*    Lesser General Public License for more details.
*
*    You should have received a copy of the GNU Lesser General Public
*    License along with this library; if not, write to the Free Software
*    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*
**/

import junit.framework.TestCase;
import org.crypto.jpir.crypto.HE;
import org.crypto.jpir.crypto.Paillier;
import org.crypto.jpir.client.NaivePIR;
import org.crypto.jpir.client.PIRClient;
import org.crypto.jpir.crypto.PaillierPrivateKey;
import org.crypto.jpir.crypto.PaillierPublicKey;
import org.crypto.jpir.server.PIRServer;
import org.crypto.jpir.util.Settings;

import java.io.*;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Properties;

import java.io.IOException;
import java.io.InputStream;

public class TestPIR extends TestCase {

    private int width;
    private int dbSize;
    private int keySize;
    private int dbDimension;
    private HE he;
    private String inputFile;
    private Properties clientProperties,serverProperties;
    public void setUp() throws Exception {
        super.setUp();
        inputFile = "in/words.txt";
        init();
        dbSize = Integer.valueOf(clientProperties.getProperty(Settings.DBSIZE));
        width = Integer.valueOf(clientProperties.getProperty(Settings.WIDTH));
        keySize = Integer.valueOf(clientProperties.getProperty(Settings.KEYSIZE));
    }

    public void testPallier() throws Exception {
        SecureRandom rnd = new SecureRandom();
        HE p_he = new Paillier(keySize, rnd);
        testPIRByIndex(p_he);
    }

    private void testPIRByIndex(HE homEnc) {
        PIRClient pirClient = new PIRClient(homEnc, width, dbSize);
        PIRServer pirServer = new PIRServer(homEnc, width, inputFile);
        dbDimension = pirServer.getDBDimension();
        for (int index = 0; index < dbDimension; index++) {
            ArrayList<BigInteger> queryItems = pirClient.generateQueryVector(index);
            ArrayList<BigInteger> responseItems = pirServer.processQuery(queryItems);
            Object resultItem = (Object) pirClient.extractResponse(responseItems, index);
            BigInteger realItem = pirServer.getRealItem(index);
            assertTrue("PIR Retrieval Status", resultItem.equals(realItem));
        }
    }

    private void init() {
        keySize = 1024;
        SecureRandom rnd = new SecureRandom();
        he = new Paillier(keySize, rnd);
        PaillierPublicKey publicKey = (PaillierPublicKey) he.getKeyPair().getPublic();
        PaillierPrivateKey privateKey = (PaillierPrivateKey) he.getKeyPair().getPrivate();

        File clientPropertiesFile = new File("C:/Users/97250/jpir_new/client.properties");
        try (InputStream in = new FileInputStream(clientPropertiesFile)) {
            clientProperties = new Properties();
            clientProperties.load(in);
        } catch (IOException e) {
            throw new RuntimeException("Error loading client properties", e);
        }

        File serverPropertiesFile = new File("C:/Users/97250/jpir_new/server.properties");
        try (InputStream in = new FileInputStream(serverPropertiesFile)) {
            serverProperties = new Properties();
            serverProperties.load(in);
        } catch (IOException e) {
            throw new RuntimeException("Error loading server properties", e);
        }
    }

}
